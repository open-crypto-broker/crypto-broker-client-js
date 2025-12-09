import * as grpc from '@grpc/grpc-js';
import { UnaryCallback } from '@grpc/grpc-js/build/src/client.js';
import { v4 as uuidv4 } from 'uuid';
import x509 from '@peculiar/x509';
import {
  CryptoGrpcClientImpl,
  HashRequest,
  HashResponse,
  SignRequest,
  SignResponse,
} from './proto/messages.js';
import {
  HealthCheckRequest,
  HealthCheckResponse,
  HealthCheckResponse_ServingStatus,
  HealthClientImpl,
} from './proto/third_party/grpc/health/v1/health.js';

type CreateCryptoBrokerClientParams = {
  credentials?: grpc.ChannelCredentials;
  options?: grpc.ClientOptions;
};
export interface Metadata {
  id?: string;
  createdAt?: string;
}

export interface HashPayload {
  profile: string;
  input: Uint8Array;
  metadata?: Metadata;
}

export interface SignPayload {
  profile: string;
  csr: string;
  caPrivateKey: string;
  caCert: string;
  validNotBeforeOffset?: string;
  validNotAfterOffset?: string;
  metadata?: Metadata;
  subject?: string;
  crlDistributionPoint?: string[];
}

export enum CertEncoding {
  B64 = 'B64',
  PEM = 'PEM',
}
const encoders = {
  [CertEncoding.B64]: (input: SignResponse): SignResponse => input, // the server provides this already
  [CertEncoding.PEM]: (input: SignResponse): SignResponse => {
    const cert = new x509.X509Certificate(input.signedCertificate);
    input.signedCertificate = cert.toString();
    return input;
  },
};

type CertOptions = {
  encoding: CertEncoding;
};

export class CryptoBrokerClient {
  private client: CryptoGrpcClientImpl;
  private healthClient: HealthClientImpl;
  private address: string;
  private conn_max_retries: number = 60;
  private conn_retry_delay_ms: number = 1000;

  constructor(opts: CreateCryptoBrokerClientParams = {}) {
    this.address = 'unix:/tmp/cryptobroker.sock';
    const conn = new grpc.Client(
      this.address,
      opts.credentials || grpc.credentials.createInsecure(),
      opts.options || {},
    );

    type RpcImpl = (
      service: string,
      method: string,
      data: Uint8Array,
    ) => Promise<Uint8Array>;
    const sendRequest: RpcImpl = (service, method, data) => {
      // Conventionally in gRPC, the request path looks like
      //   "package.names.ServiceName/MethodName",
      // we therefore construct such a string
      const path = `/${service}/${method}`;

      return new Promise((resolve, reject) => {
        // makeUnaryRequest transmits the result (and error) with a callback
        // transform this into a promise!
        const resultCallback: UnaryCallback<unknown> = (err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(res as Uint8Array);
        };

        function passThrough(argument: unknown) {
          return argument;
        }

        const sendRetryRequest = (tries: number = 1) => {
          const now = new Date();
          const deadline = now.setMilliseconds(
            now.getMilliseconds() + this.conn_retry_delay_ms,
          );
          if (tries <= this.conn_max_retries) {
            conn.waitForReady(deadline, async (err: Error | undefined) => {
              if (err) {
                console.log(
                  `Could not establish connection. Retrying... (${tries}/${this.conn_max_retries})`,
                );
                sendRetryRequest(tries + 1);
              } else {
                // Using passThrough as the deserialize functions
                conn.makeUnaryRequest(
                  path,
                  (d) => Buffer.from(d),
                  passThrough,
                  data,
                  resultCallback,
                );
              }
            });
          } else reject(Error('retry limit reached'));
        };

        // retry until a connection was successful or the maximum retry amount was reached
        sendRetryRequest();
      });
    };
    const rpc = { request: sendRequest };
    const hcRpc = {
      request: sendRequest,
    };
    this.client = new CryptoGrpcClientImpl(rpc);
    this.healthClient = new HealthClientImpl(hcRpc);
  }

  async hashData(payload: HashPayload): Promise<HashResponse> {
    const req: HashRequest = {
      profile: payload.profile,
      input: payload.input,
      metadata: {
        id: payload.metadata?.id || uuidv4(),
        createdAt: payload.metadata?.createdAt || new Date().toString(),
      },
    };
    return this.client.Hash(req).then((res: HashResponse) => res);
  }

  async signCertificate(
    payload: SignPayload,
    options?: CertOptions,
  ): Promise<SignResponse> {
    // Prepare the Request
    const req: SignRequest = {
      profile: payload.profile,
      csr: payload.csr,
      caPrivateKey: payload.caPrivateKey,
      caCert: payload.caCert,
      metadata: {
        id: payload.metadata?.id || uuidv4(),
        createdAt: payload.metadata?.createdAt || new Date().toString(),
      },
      validNotBeforeOffset: payload.validNotBeforeOffset,
      validNotAfterOffset: payload.validNotAfterOffset,
      subject: payload.subject,
      crlDistributionPoints: payload.crlDistributionPoint || [],
    };
    // Apply options
    const encoding = (options && options.encoding) || CertEncoding.PEM;
    // Send the Request
    return this.client
      .Sign(req)
      .then((res: SignResponse) => encoders[encoding](res));
  }

  async healthData(): Promise<HealthCheckResponse> {
    const req: HealthCheckRequest = {
      service: '',
    };
    // mocking unknown status in the case the server is not reachable
    const status_unknown: HealthCheckResponse = {
      status: HealthCheckResponse_ServingStatus.UNKNOWN,
    };

    return this.healthClient
      .Check(req)
      .then((res: HealthCheckResponse) => res)
      .catch(() => status_unknown);
  }
}

export const credentials = grpc.credentials;
export { HealthCheckResponse_ServingStatus } from './proto/third_party/grpc/health/v1/health.js';
