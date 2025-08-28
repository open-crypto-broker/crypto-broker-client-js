import * as grpc from '@grpc/grpc-js';
import { UnaryCallback } from '@grpc/grpc-js/build/src/client.js';
import { v4 as uuidv4 } from 'uuid';
import {
  CryptoBrokerClientImpl,
  HashRequest,
  HashResponse,
  SignRequest,
  SignResponse,
} from './proto/messages.js';

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

export class CryptoBrokerClient {
  private client: CryptoBrokerClientImpl;
  private address: string;

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

        // Using passThrough as the deserialize functions
        conn.makeUnaryRequest(
          path,
          (d) => Buffer.from(d),
          passThrough,
          data,
          resultCallback,
        );
      });
    };
    const rpc = { request: sendRequest };
    this.client = new CryptoBrokerClientImpl(rpc);
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

  async signCertificate(payload: SignPayload): Promise<SignResponse> {
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
    return this.client.Sign(req).then((res: SignResponse) => res);
  }
}

export const credentials = grpc.credentials;
