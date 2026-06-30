import 'reflect-metadata';
import * as grpc from '@grpc/grpc-js';
import { UnaryCallback } from '@grpc/grpc-js/build/src/client.js';
import { defaultServiceConfig } from './conf/service_config.js';
import {
  CircuitBreakerConfig,
  circuitBreakerConfigFactory,
} from './conf/circuitbreaker_config.js';
import { randomUUID } from 'crypto';
import x509 from '@peculiar/x509';
import {
  CryptoGrpcClientImpl,
  CryptoGrpcDevClientImpl,
  BenchmarkRequest,
  BenchmarkResponse,
  HashRequest,
  HashResponse,
  SignRequest,
  SignResponse,
} from './proto/messages.js';
import {
  HealthCheckRequest,
  HealthCheckResponse,
  HealthClientImpl,
} from './proto/third_party/grpc/health/v1/health.js';
import {
  validateBenchmarkPayload,
  validateCertOptions,
  validateHashPayload,
  validateSignPayload,
} from './request_validation.js';
import type Long from 'long';
import { ClientOptions } from '@grpc/grpc-js';
import CircuitBreaker from 'opossum';

export interface ConnectOptions {
  retryAmount: number;
}

type CreateCryptoBrokerClientParams = {
  grpcOptions?: grpc.ClientOptions;
  circuitBreakerOptions?: CircuitBreakerConfig;
  connectOptions?: ConnectOptions;
};

export interface TraceContext {
  traceId: string;
  spanId: string;
  traceFlags: string;
  traceState: string;
  correlationId: string;
}

export interface Metadata {
  id: string;
  traceContext?: TraceContext;
}

export interface BenchmarkPayload {
  metadata?: Metadata;
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
  validNotBefore?: Long;
  validNotAfter?: Long;
  metadata?: Metadata;
  subject?: string;
  crlDistributionPoints?: string[];
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

const breakers = new WeakMap<object, Map<string, CircuitBreaker>>();

// circuit breaker decorator
function WithCircuitBreaker(
  _prototype: object,
  name: string,
  descriptor: PropertyDescriptor,
) {
  const original = descriptor.value;

  descriptor.value = function (...args: unknown[]) {
    const self = this as { breakerConfig: CircuitBreakerConfig };

    let byMethod = breakers.get(self);
    if (!byMethod) {
      byMethod = new Map();
      breakers.set(self, byMethod);
    }

    let breaker = byMethod.get(name);
    if (!breaker) {
      breaker = new CircuitBreaker(
        (...args: unknown[]) => original.apply(this, args),
        self.breakerConfig,
      );
      byMethod.set(name, breaker);
    }

    return breaker.fire(...args);
  };

  return descriptor;
}

export class CryptoBrokerClient {
  private client: CryptoGrpcClientImpl;
  private healthClient: HealthClientImpl;
  private devClient: CryptoGrpcDevClientImpl;
  private address: string;
  private conn: grpc.Client;
  private breakerConfig: CircuitBreakerConfig;

  constructor(opts: CreateCryptoBrokerClientParams = {}) {
    // setup of connection parameters
    this.address = 'unix:/tmp/open-crypto-broker/crypto-broker-server.sock';

    // apply grpc client configuration
    const grpcOptions: ClientOptions = {
      // set retry policy via service config
      ['grpc.service_config']: JSON.stringify(defaultServiceConfig),
      ...opts.grpcOptions,
    };

    // apply circuit breaker configuration
    this.breakerConfig = circuitBreakerConfigFactory(
      opts.circuitBreakerOptions,
    );

    this.conn = new grpc.Client(
      this.address,
      grpc.credentials.createInsecure(),
      grpcOptions,
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
        this.conn.makeUnaryRequest(
          path,
          (d) => Buffer.from(d),
          passThrough,
          data,
          resultCallback,
        );
      });
    };

    const rpc = { request: sendRequest };
    const hcRpc = {
      request: sendRequest,
    };
    this.client = new CryptoGrpcClientImpl(rpc);
    this.healthClient = new HealthClientImpl(hcRpc);
    this.devClient = new CryptoGrpcDevClientImpl(rpc);
  }

  static async NewLibrary(
    opts?: CreateCryptoBrokerClientParams,
  ): Promise<CryptoBrokerClient> {
    const instance = new CryptoBrokerClient(opts);

    const conn_max_retries: number = opts?.connectOptions?.retryAmount ?? 60;
    const conn_retry_delay_ms: number = 1000;

    for (let attempt = 1; attempt <= conn_max_retries; attempt++) {
      const deadline = Date.now() + conn_retry_delay_ms;

      try {
        await new Promise<void>((resolve, reject) => {
          instance.conn.waitForReady(deadline, (err) =>
            err ? reject(err) : resolve(),
          );
        });
        return instance; // when ready
      } catch {
        console.error(
          `Could not establish connection. Retrying... (${attempt}/${conn_max_retries})`,
        );
      }
    }

    throw new Error('retry limit reached');
  }

  async benchmarkData(payload: BenchmarkPayload): Promise<BenchmarkResponse> {
    validateBenchmarkPayload(payload);
    const req: BenchmarkRequest = {
      metadata: {
        id: payload.metadata?.id || randomUUID(),
        ...(payload.metadata?.traceContext !== undefined && {
          traceContext: payload.metadata?.traceContext,
        }),
      },
    };
    return this.devClient.Benchmark(req).then((res: BenchmarkResponse) => res);
  }

  @WithCircuitBreaker
  async hashData(payload: HashPayload): Promise<HashResponse> {
    validateHashPayload(payload);
    const req: HashRequest = {
      profile: payload.profile,
      input: payload.input,
      metadata: {
        id: payload.metadata?.id || randomUUID(),
        ...(payload.metadata?.traceContext !== undefined && {
          traceContext: payload.metadata?.traceContext,
        }),
      },
    };
    return this.client.Hash(req).then((res: HashResponse) => res);
  }

  @WithCircuitBreaker
  async signCertificate(
    payload: SignPayload,
    options?: CertOptions,
  ): Promise<SignResponse> {
    validateSignPayload(payload);
    validateCertOptions(options);
    // Prepare the Request
    const req: SignRequest = {
      profile: payload.profile,
      csr: payload.csr,
      caPrivateKey: payload.caPrivateKey,
      caCert: payload.caCert,
      metadata: {
        id: payload.metadata?.id || randomUUID(),
        ...(payload.metadata?.traceContext !== undefined && {
          traceContext: payload.metadata?.traceContext,
        }),
      },
      validNotBefore: payload.validNotBefore,
      validNotAfter: payload.validNotAfter,
      subject: payload.subject,
      crlDistributionPoints: payload.crlDistributionPoints || [],
    };
    // Apply options
    const encoding = (options && options.encoding) || CertEncoding.PEM;
    // Send the Request
    return this.client
      .Sign(req)
      .then((res: SignResponse) => encoders[encoding](res));
  }

  @WithCircuitBreaker
  async healthData(): Promise<HealthCheckResponse> {
    const req: HealthCheckRequest = {
      service: '',
    };
    // setting the UNKNOWN service status in the case the server is not reachable
    const status_unknown: HealthCheckResponse = {
      status: 0,
    };

    return this.healthClient
      .Check(req)
      .then((res: HealthCheckResponse) => res)
      .catch(() => status_unknown);
  }
}

export const VERSION = __VERSION__;
export const GIT_HASH = __GIT_HASH__;
