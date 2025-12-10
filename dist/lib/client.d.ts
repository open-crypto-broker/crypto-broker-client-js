import * as grpc from '@grpc/grpc-js';
import { HashResponse, SignResponse } from './proto/messages.js';
import { HealthCheckResponse } from './proto/third_party/grpc/health/v1/health.js';
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
    validNotBefore?: number;
    validNotAfter?: number;
    metadata?: Metadata;
    subject?: string;
    crlDistributionPoint?: string[];
}
export declare enum CertEncoding {
    B64 = "B64",
    PEM = "PEM"
}
type CertOptions = {
    encoding: CertEncoding;
};
export declare class CryptoBrokerClient {
    private client;
    private healthClient;
    private address;
    private conn_max_retries;
    private conn_retry_delay_ms;
    constructor(opts?: CreateCryptoBrokerClientParams);
    hashData(payload: HashPayload): Promise<HashResponse>;
    signCertificate(payload: SignPayload, options?: CertOptions): Promise<SignResponse>;
    healthData(): Promise<HealthCheckResponse>;
}
export declare const credentials: {
    combineChannelCredentials: (channelCredentials: grpc.ChannelCredentials, ...callCredentials: grpc.CallCredentials[]) => grpc.ChannelCredentials;
    combineCallCredentials: (first: grpc.CallCredentials, ...additional: grpc.CallCredentials[]) => grpc.CallCredentials;
    createInsecure: typeof grpc.ChannelCredentials.createInsecure;
    createSsl: typeof grpc.ChannelCredentials.createSsl;
    createFromSecureContext: typeof grpc.ChannelCredentials.createFromSecureContext;
    createFromMetadataGenerator: typeof grpc.CallCredentials.createFromMetadataGenerator;
    createFromGoogleCredential: typeof grpc.CallCredentials.createFromGoogleCredential;
    createEmpty: typeof grpc.CallCredentials.createEmpty;
};
export { HealthCheckResponse_ServingStatus } from './proto/third_party/grpc/health/v1/health.js';
