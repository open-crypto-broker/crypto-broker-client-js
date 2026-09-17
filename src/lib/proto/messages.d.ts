import { BinaryReader, BinaryWriter } from '@bufbuild/protobuf/wire';
export declare const protobufPackage = 'CryptoBroker';
/** Output formats */
export declare enum HashOutputFormat {
  HEX = 0,
  RAW = 1,
  UNRECOGNIZED = -1,
}
export declare function hashOutputFormatFromJSON(object: any): HashOutputFormat;
export declare function hashOutputFormatToJSON(
  object: HashOutputFormat,
): string;
export declare enum SignOutputFormat {
  DER = 0,
  PEM = 1,
  UNRECOGNIZED = -1,
}
export declare function signOutputFormatFromJSON(object: any): SignOutputFormat;
export declare function signOutputFormatToJSON(
  object: SignOutputFormat,
): string;
/** Single source of truth for gRPC message size limits, applied as transport options in the server and clients. */
export declare enum MessageSizeLimit {
  MESSAGE_SIZE_LIMIT_UNSPECIFIED = 0,
  /** MESSAGE_SIZE_LIMIT_MAX_REQUEST_BYTES - Max request accepted from client to server (2 MiB). */
  MESSAGE_SIZE_LIMIT_MAX_REQUEST_BYTES = 2097152,
  /** MESSAGE_SIZE_LIMIT_MAX_RESPONSE_BYTES - Max response returned from server to client (1 MiB). */
  MESSAGE_SIZE_LIMIT_MAX_RESPONSE_BYTES = 1048576,
  UNRECOGNIZED = -1,
}
export declare function messageSizeLimitFromJSON(object: any): MessageSizeLimit;
export declare function messageSizeLimitToJSON(
  object: MessageSizeLimit,
): string;
/** Meta-structures shared across other messages and functions */
export interface Metadata {
  id: string;
  /** Attached to every response produced with a deprecated profile (see ADR 0013). */
  deprecation?: DeprecationWarning | undefined;
  traceContext?: TraceContext | undefined;
}
/**
 * Self-describing record of how a stored artifact was produced (see ADR 0013).
 * Persisted by the caller alongside the value so it stays verifiable and
 * migratable without access to Profiles.yaml.
 */
export interface CryptoDescriptor {
  profile: string;
  /** The API that produced the artifact, e.g. "HashData", "SignCertificate", "EncryptData". */
  operation: string;
  /** The concrete algorithm actually used, e.g. "sha3-512", "aes-gcm". */
  algorithm: string;
}
/**
 * Deprecation signal for a profile scheduled for a rolling migration (see ADR 0013).
 * replacedBy should point to an equal-or-stronger profile.
 */
export interface DeprecationWarning {
  profile: string;
  replacedBy?: string | undefined;
  deprecatedSince?: string | undefined;
  removeAfter?: string | undefined;
  reason?: string | undefined;
}
/** Trace context for manual propagation */
export interface TraceContext {
  traceId: string;
  spanId: string;
  traceFlags: string;
  traceState: string;
  correlationId: string;
}
/**
 * Key material source for symmetric encryption/decryption.
 * Exactly one variant is set, governed by the profile:
 * rawKey for caller-managed profiles (no KMS), keyId for KMS profiles where the broker
 * resolves the identifier and retrieves the externally provisioned key. The broker never
 * creates, imports, or deletes keys; key lifecycle is owned by the KMS/operator.
 */
export interface KeySource {
  keyId?: string | undefined;
  rawKey?: Uint8Array | undefined;
}
/**
 * Caller-supplied encryption parameters. The nonce is always provided by the caller;
 * neither the broker nor the KMS generates it, so the caller owns nonce-uniqueness. AAD is optional.
 */
export interface EncryptMetadata {
  nonce: Uint8Array;
  aad?: Uint8Array | undefined;
}
/**
 * Metadata returned alongside the ciphertext by EncryptData. It encapsulates
 * everything the caller may need besides the ciphertext itself:
 *   - keyId: echoed for KMS profiles; key material is never returned.
 *   - nonce/aad: echoed back; the caller supplied them and must retain them to decrypt.
 *   - tag: the authentication tag the caller must retain to decrypt later.
 */
export interface CipherMetadata {
  keyId?: string | undefined;
  nonce: Uint8Array;
  aad?: Uint8Array | undefined;
  tag?: Uint8Array | undefined;
}
/**
 * Caller-supplied parameters for DecryptData. Symmetric to EncryptMetadata.
 * The caller provides the nonce, AAD and tag, typically by echoing back the
 * values from the CipherMetadata receipt returned by EncryptData.
 */
export interface DecryptMetadata {
  nonce: Uint8Array;
  aad?: Uint8Array | undefined;
  tag?: Uint8Array | undefined;
}
/** HashData request and response messages */
export interface HashDataRequest {
  profile: string;
  input: Uint8Array;
  metadata: Metadata | undefined;
  outputFormat: HashOutputFormat;
}
export interface HashDataResponse {
  /** Redundant with descriptor.algorithm; retained for backward compatibility. */
  hashAlgorithm: string;
  metadata: Metadata | undefined;
  hashValueHex?: string | undefined;
  hashValueRaw?: Uint8Array | undefined;
  descriptor: CryptoDescriptor | undefined;
}
/** SignCertificate response and request messages */
export interface SignCertificateRequest {
  profile: string;
  csr: string;
  caPrivateKey: string;
  caCert: string;
  metadata: Metadata | undefined;
  validNotBefore?: bigint | undefined;
  validNotAfter?: bigint | undefined;
  subject?: string | undefined;
  crlDistributionPoints: string[];
  outputFormat: SignOutputFormat;
}
/** Response to a SignCertificate Request */
export interface SignCertificateResponse {
  metadata: Metadata | undefined;
  pem?: string | undefined;
  der?: Uint8Array | undefined;
  descriptor: CryptoDescriptor | undefined;
}
/** EncryptData request and response messages */
export interface EncryptDataRequest {
  profile: string;
  keySource: KeySource | undefined;
  plaintext: Uint8Array;
  encryptMetadata: EncryptMetadata | undefined;
  metadata: Metadata | undefined;
}
export interface EncryptDataResponse {
  ciphertext: Uint8Array;
  cipherMetadata: CipherMetadata | undefined;
  metadata: Metadata | undefined;
  descriptor: CryptoDescriptor | undefined;
}
/** DecryptData request and response messages */
export interface DecryptDataRequest {
  profile: string;
  keySource: KeySource | undefined;
  ciphertext: Uint8Array;
  decryptMetadata: DecryptMetadata | undefined;
  metadata: Metadata | undefined;
}
export interface DecryptDataResponse {
  plaintext: Uint8Array;
  metadata: Metadata | undefined;
}
/** Benchmark request and response messages */
export interface BenchmarkRequest {
  metadata: Metadata | undefined;
}
export interface BenchmarkResponse {
  benchmarkResults: string;
  metadata: Metadata | undefined;
}
/** FakeEndpoint request and response messages */
export interface FakeEndpointRequest {
  metadata: Metadata | undefined;
}
export interface FakeEndpointResponse {
  message: string;
  metadata: Metadata | undefined;
}
export declare const Metadata: MessageFns<Metadata>;
export declare const CryptoDescriptor: MessageFns<CryptoDescriptor>;
export declare const DeprecationWarning: MessageFns<DeprecationWarning>;
export declare const TraceContext: MessageFns<TraceContext>;
export declare const KeySource: MessageFns<KeySource>;
export declare const EncryptMetadata: MessageFns<EncryptMetadata>;
export declare const CipherMetadata: MessageFns<CipherMetadata>;
export declare const DecryptMetadata: MessageFns<DecryptMetadata>;
export declare const HashDataRequest: MessageFns<HashDataRequest>;
export declare const HashDataResponse: MessageFns<HashDataResponse>;
export declare const SignCertificateRequest: MessageFns<SignCertificateRequest>;
export declare const SignCertificateResponse: MessageFns<SignCertificateResponse>;
export declare const EncryptDataRequest: MessageFns<EncryptDataRequest>;
export declare const EncryptDataResponse: MessageFns<EncryptDataResponse>;
export declare const DecryptDataRequest: MessageFns<DecryptDataRequest>;
export declare const DecryptDataResponse: MessageFns<DecryptDataResponse>;
export declare const BenchmarkRequest: MessageFns<BenchmarkRequest>;
export declare const BenchmarkResponse: MessageFns<BenchmarkResponse>;
export declare const FakeEndpointRequest: MessageFns<FakeEndpointRequest>;
export declare const FakeEndpointResponse: MessageFns<FakeEndpointResponse>;
/** Application-facing crypto service definition */
export interface CryptoGrpc {
  HashData(request: HashDataRequest): Promise<HashDataResponse>;
  SignCertificate(
    request: SignCertificateRequest,
  ): Promise<SignCertificateResponse>;
  EncryptData(request: EncryptDataRequest): Promise<EncryptDataResponse>;
  DecryptData(request: DecryptDataRequest): Promise<DecryptDataResponse>;
}
export declare const CryptoGrpcServiceName = 'CryptoBroker.CryptoGrpc';
export declare class CryptoGrpcClientImpl implements CryptoGrpc {
  private readonly rpc;
  private readonly service;
  constructor(
    rpc: Rpc,
    opts?: {
      service?: string;
    },
  );
  HashData(request: HashDataRequest): Promise<HashDataResponse>;
  SignCertificate(
    request: SignCertificateRequest,
  ): Promise<SignCertificateResponse>;
  EncryptData(request: EncryptDataRequest): Promise<EncryptDataResponse>;
  DecryptData(request: DecryptDataRequest): Promise<DecryptDataResponse>;
}
/** Internal development service definition */
export interface CryptoGrpcDev {
  Benchmark(request: BenchmarkRequest): Promise<BenchmarkResponse>;
  FakeEndpoint(request: FakeEndpointRequest): Promise<FakeEndpointResponse>;
}
export declare const CryptoGrpcDevServiceName = 'CryptoBroker.CryptoGrpcDev';
export declare class CryptoGrpcDevClientImpl implements CryptoGrpcDev {
  private readonly rpc;
  private readonly service;
  constructor(
    rpc: Rpc,
    opts?: {
      service?: string;
    },
  );
  Benchmark(request: BenchmarkRequest): Promise<BenchmarkResponse>;
  FakeEndpoint(request: FakeEndpointRequest): Promise<FakeEndpointResponse>;
}
interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array,
  ): Promise<Uint8Array>;
}
type Builtin =
  Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends bigint
  ? string | number | bigint
  : T extends Builtin
    ? T
    : T extends globalThis.Array<infer U>
      ? globalThis.Array<DeepPartial<U>>
      : T extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : T extends {}
          ? {
              [K in keyof T]?: DeepPartial<T[K]>;
            }
          : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & {
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
