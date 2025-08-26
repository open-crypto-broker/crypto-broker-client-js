import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "protobuf";
/** Metadata shared accross al methods */
export interface Metadata {
    id: string;
    createdAt: string;
}
/** Message for a Hash Request */
export interface HashRequest {
    profile: string;
    input: Uint8Array;
    metadata: Metadata | undefined;
}
/** Response to a Hash Request */
export interface HashResponse {
    hashValue: string;
    hashAlgorithm: string;
    metadata: Metadata | undefined;
}
/** Message for a CSR (Certificate Sign Request) */
export interface SignRequest {
    profile: string;
    csr: string;
    caPrivateKey: string;
    caCert: string;
    metadata: Metadata | undefined;
    validNotBeforeOffset?: string | undefined;
    validNotAfterOffset?: string | undefined;
    subject?: string | undefined;
    crlDistributionPoints: string[];
}
/** Response to a Sign Request */
export interface SignResponse {
    signedCertificate: string;
    metadata: Metadata | undefined;
}
export declare const Metadata: MessageFns<Metadata>;
export declare const HashRequest: MessageFns<HashRequest>;
export declare const HashResponse: MessageFns<HashResponse>;
export declare const SignRequest: MessageFns<SignRequest>;
export declare const SignResponse: MessageFns<SignResponse>;
export interface CryptoBroker {
    Hash(request: HashRequest): Promise<HashResponse>;
    Sign(request: SignRequest): Promise<SignResponse>;
}
export declare const CryptoBrokerServiceName = "protobuf.CryptoBroker";
export declare class CryptoBrokerClientImpl implements CryptoBroker {
    private readonly rpc;
    private readonly service;
    constructor(rpc: Rpc, opts?: {
        service?: string;
    });
    Hash(request: HashRequest): Promise<HashResponse>;
    Sign(request: SignRequest): Promise<SignResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
    fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
export {};
