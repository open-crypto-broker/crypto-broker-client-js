import "reflect-metadata";
import * as grpc from "@grpc/grpc-js";
//#region src/lib/conf/circuitbreaker_config.d.ts
interface CircuitBreakerConfig {
  enabled: boolean;
  name?: string;
  rollingCountTimeout?: number;
  timeout?: number;
  errorThresholdPercentage?: number;
  resetTimeout?: number;
  failureStatusCodes?: number[];
  errorFilter?: (err: Error) => boolean;
}
//#endregion
//#region node_modules/@bufbuild/protobuf/dist/esm/wire/binary-encoding.d.ts
/**
 * Protobuf binary format wire types.
 *
 * A wire type provides just enough information to find the length of the
 * following value.
 *
 * See https://developers.google.com/protocol-buffers/docs/encoding#structure
 */
declare enum WireType {
  /**
   * Used for int32, int64, uint32, uint64, sint32, sint64, bool, enum
   */
  Varint = 0,
  /**
   * Used for fixed64, sfixed64, double.
   * Always 8 bytes with little-endian byte order.
   */
  Bit64 = 1,
  /**
   * Used for string, bytes, embedded messages, packed repeated fields
   *
   * Only repeated numeric types (types which use the varint, 32-bit,
   * or 64-bit wire types) can be packed. In proto3, such fields are
   * packed by default.
   */
  LengthDelimited = 2,
  /**
   * Start of a tag-delimited aggregate, such as a proto2 group, or a message
   * in editions with message_encoding = DELIMITED.
   */
  StartGroup = 3,
  /**
   * End of a tag-delimited aggregate.
   */
  EndGroup = 4,
  /**
   * Used for fixed32, sfixed32, float.
   * Always 4 bytes with little-endian byte order.
   */
  Bit32 = 5
}
declare class BinaryWriter {
  private readonly encodeUtf8;
  /**
   * We cannot allocate a buffer for the entire output
   * because we don't know its size.
   *
   * So we collect smaller chunks of known size and
   * concat them later.
   *
   * Use `raw()` to push data to this array. It will flush
   * `buf` first.
   */
  private chunks;
  /**
   * A growing buffer for byte values. If you don't know
   * the size of the data you are writing, push to this
   * array.
   */
  protected buf: number[];
  /**
   * Previous fork states.
   */
  private stack;
  constructor(encodeUtf8?: (text: string) => Uint8Array);
  /**
   * Return all bytes written and reset this writer.
   */
  finish(): Uint8Array<ArrayBuffer>;
  /**
   * Start a new fork for length-delimited data like a message
   * or a packed repeated field.
   *
   * Must be joined later with `join()`.
   */
  fork(): this;
  /**
   * Join the last fork. Write its length and bytes, then
   * return to the previous state.
   */
  join(): this;
  /**
   * Writes a tag (field number and wire type).
   *
   * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
   *
   * Generated code should compute the tag ahead of time and call `uint32()`.
   */
  tag(fieldNo: number, type: WireType): this;
  /**
   * Write a chunk of raw bytes.
   */
  raw(chunk: Uint8Array): this;
  /**
   * Write a `uint32` value, an unsigned 32 bit varint.
   */
  uint32(value: number): this;
  /**
   * Write a `int32` value, a signed 32 bit varint.
   */
  int32(value: number): this;
  /**
   * Write a `bool` value, a varint.
   */
  bool(value: boolean): this;
  /**
   * Write a `bytes` value, length-delimited arbitrary data.
   */
  bytes(value: Uint8Array): this;
  /**
   * Write a `string` value, length-delimited data converted to UTF-8 text.
   */
  string(value: string): this;
  /**
   * Write a `float` value, 32-bit floating point number.
   */
  float(value: number): this;
  /**
   * Write a `double` value, a 64-bit floating point number.
   */
  double(value: number): this;
  /**
   * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
   */
  fixed32(value: number): this;
  /**
   * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
   */
  sfixed32(value: number): this;
  /**
   * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
   */
  sint32(value: number): this;
  /**
   * Write a `sfixed64` value, a signed, fixed-length 64-bit integer.
   */
  sfixed64(value: string | number | bigint): this;
  /**
   * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
   */
  fixed64(value: string | number | bigint): this;
  /**
   * Write a `int64` value, a signed 64-bit varint.
   */
  int64(value: string | number | bigint): this;
  /**
   * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64(value: string | number | bigint): this;
  /**
   * Write a `uint64` value, an unsigned 64-bit varint.
   */
  uint64(value: string | number | bigint): this;
}
declare class BinaryReader {
  private readonly decodeUtf8;
  /**
   * Current position.
   */
  pos: number;
  /**
   * Number of bytes available in this reader.
   */
  readonly len: number;
  protected readonly buf: Uint8Array;
  private readonly view;
  constructor(buf: Uint8Array, decodeUtf8?: (bytes: Uint8Array, strict?: boolean) => string);
  /**
   * Reads a tag - field number and wire type. Tags are uint32 varints; values
   * that do not fit in uint32 are rejected.
   */
  tag(): [number, WireType];
  /**
   * Skip one element and return the skipped data.
   *
   * When skipping StartGroup, provide the tags field number to check for
   * matching field number in the EndGroup tag. Recursion into nested groups
   * is guarded by the `recursionLimit` argument: When the limit is reached,
   * this method throws.
   */
  skip(wireType: WireType, fieldNo?: number, recursionLimit?: number): Uint8Array;
  protected varint64: () => [number, number];
  /**
   * Throws error if position in byte array is out of range.
   */
  protected assertBounds(): void;
  /**
   * Read a `uint32` field, an unsigned 32 bit varint.
   */
  uint32: () => number;
  /**
   * Read a `int32` field, a signed 32 bit varint.
   */
  int32(): number;
  /**
   * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
   */
  sint32(): number;
  /**
   * Read a `int64` field, a signed 64-bit varint.
   */
  int64(): bigint | string;
  /**
   * Read a `uint64` field, an unsigned 64-bit varint.
   */
  uint64(): bigint | string;
  /**
   * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64(): bigint | string;
  /**
   * Read a `bool` field, a variant.
   */
  bool(): boolean;
  /**
   * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
   */
  fixed32(): number;
  /**
   * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
   */
  sfixed32(): number;
  /**
   * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
   */
  fixed64(): bigint | string;
  /**
   * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
   */
  sfixed64(): bigint | string;
  /**
   * Read a `float` field, 32-bit floating point number.
   */
  float(): number;
  /**
   * Read a `double` field, a 64-bit floating point number.
   */
  double(): number;
  /**
   * Read a `bytes` field, length-delimited arbitrary data.
   */
  bytes(): Uint8Array;
  /**
   * Read a `string` field, length-delimited data converted to UTF-8 text. If
   * `strict` is true, throw on invalid UTF-8 instead of substituting U+FFFD.
   */
  string(strict?: boolean): string;
}
//#endregion
//#region src/lib/proto/messages.d.ts
/** Output formats */
declare enum HashOutputFormat {
  HEX = 0,
  RAW = 1,
  UNRECOGNIZED = -1
}
declare enum SignOutputFormat {
  DER = 0,
  PEM = 1,
  UNRECOGNIZED = -1
}
/** Meta-structures shared across other messages and functions */
interface Metadata$1 {
  id: string;
  /** Attached to every response produced with a deprecated profile (see ADR 0013). */
  deprecation?: DeprecationWarning | undefined;
  traceContext?: TraceContext$1 | undefined;
}
/**
 * Self-describing record of how a stored artifact was produced (see ADR 0013).
 * Persisted by the caller alongside the value so it stays verifiable and
 * migratable without access to Profiles.yaml.
 */
interface CryptoDescriptor {
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
interface DeprecationWarning {
  profile: string;
  replacedBy?: string | undefined;
  deprecatedSince?: string | undefined;
  removeAfter?: string | undefined;
  reason?: string | undefined;
}
/** Trace context for manual propagation */
interface TraceContext$1 {
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
interface KeySource {
  keyId?: string | undefined;
  rawKey?: Uint8Array | undefined;
}
/**
 * Caller-supplied encryption parameters. The nonce is always provided by the caller;
 * neither the broker nor the KMS generates it, so the caller owns nonce-uniqueness. AAD is optional.
 */
interface EncryptMetadata {
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
interface CipherMetadata {
  keyId?: string | undefined;
  nonce: Uint8Array;
  aad?: Uint8Array | undefined;
  tag?: Uint8Array | undefined;
  /** Self-describing descriptor persisted alongside the ciphertext (see ADR 0013). */
  descriptor: CryptoDescriptor | undefined;
}
/**
 * Caller-supplied parameters for DecryptData. Symmetric to EncryptMetadata.
 * The caller provides the nonce, AAD and tag, typically by echoing back the
 * values from the CipherMetadata receipt returned by EncryptData.
 */
interface DecryptMetadata {
  nonce: Uint8Array;
  aad?: Uint8Array | undefined;
  tag?: Uint8Array | undefined;
}
interface HashDataResponse {
  /** Redundant with descriptor.algorithm; retained for backward compatibility. */
  hashAlgorithm: string;
  metadata: Metadata$1 | undefined;
  hashValueHex?: string | undefined;
  hashValueRaw?: Uint8Array | undefined;
  descriptor: CryptoDescriptor | undefined;
}
/** Response to a SignCertificate Request */
interface SignCertificateResponse {
  metadata: Metadata$1 | undefined;
  pem?: string | undefined;
  der?: Uint8Array | undefined;
  descriptor: CryptoDescriptor | undefined;
}
interface EncryptDataResponse {
  ciphertext: Uint8Array;
  cipherMetadata: CipherMetadata | undefined;
  metadata: Metadata$1 | undefined;
}
interface DecryptDataResponse {
  plaintext: Uint8Array;
  metadata: Metadata$1 | undefined;
}
interface BenchmarkResponse {
  benchmarkResults: string;
  metadata: Metadata$1 | undefined;
}
declare const Metadata$1: MessageFns$1<Metadata$1>;
declare const CryptoDescriptor: MessageFns$1<CryptoDescriptor>;
declare const DeprecationWarning: MessageFns$1<DeprecationWarning>;
declare const TraceContext$1: MessageFns$1<TraceContext$1>;
declare const KeySource: MessageFns$1<KeySource>;
declare const EncryptMetadata: MessageFns$1<EncryptMetadata>;
declare const CipherMetadata: MessageFns$1<CipherMetadata>;
declare const DecryptMetadata: MessageFns$1<DecryptMetadata>;
declare const HashDataResponse: MessageFns$1<HashDataResponse>;
declare const SignCertificateResponse: MessageFns$1<SignCertificateResponse>;
declare const EncryptDataResponse: MessageFns$1<EncryptDataResponse>;
declare const DecryptDataResponse: MessageFns$1<DecryptDataResponse>;
declare const BenchmarkResponse: MessageFns$1<BenchmarkResponse>;
type Builtin$1 = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
type DeepPartial$1<T> = T extends bigint ? string | number | bigint : T extends Builtin$1 ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial$1<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial$1<U>> : T extends {} ? { [K in keyof T]?: DeepPartial$1<T[K]>; } : Partial<T>;
type KeysOfUnion$1<T> = T extends T ? keyof T : never;
type Exact$1<P, I extends P> = P extends Builtin$1 ? P : P & { [K in keyof P]: Exact$1<P[K], I[K]>; } & { [K in Exclude<keyof I, KeysOfUnion$1<P>>]: never; };
interface MessageFns$1<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact$1<DeepPartial$1<T>, I>>(base?: I): T;
  fromPartial<I extends Exact$1<DeepPartial$1<T>, I>>(object: I): T;
}
//#endregion
//#region src/lib/proto/third_party/grpc/health/v1/health.d.ts
interface HealthCheckResponse {
  status: HealthCheckResponse_ServingStatus;
}
declare enum HealthCheckResponse_ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
  /** SERVICE_UNKNOWN - Used only by the Watch method. */
  SERVICE_UNKNOWN = 3,
  UNRECOGNIZED = -1
}
declare const HealthCheckResponse: MessageFns<HealthCheckResponse>;
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]>; } : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin ? P : P & { [K in keyof P]: Exact<P[K], I[K]>; } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never; };
interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
//#endregion
//#region src/lib/client.d.ts
interface ConnectOptions {
  retryAmount: number;
}
type CreateCryptoBrokerClientParams = {
  grpcOptions?: grpc.ClientOptions;
  circuitBreakerOptions?: CircuitBreakerConfig;
  connectOptions?: ConnectOptions;
};
interface TraceContext {
  traceId: string;
  spanId: string;
  traceFlags: string;
  traceState: string;
  correlationId: string;
}
interface Metadata {
  id: string;
  traceContext?: TraceContext;
}
interface BenchmarkPayload {
  metadata?: Metadata;
}
interface HashDataPayload {
  profile: string;
  input: Uint8Array;
  metadata?: Metadata;
  outputFormat: HashOutputFormat;
}
interface SignCertificatePayload {
  profile: string;
  csr: string;
  caPrivateKey: string;
  caCert: string;
  validNotBefore?: bigint;
  validNotAfter?: bigint;
  metadata?: Metadata;
  subject?: string;
  crlDistributionPoints?: string[];
  outputFormat: SignOutputFormat;
}
interface EncryptDataPayload {
  profile: string;
  keySource: KeySource;
  plaintext: Uint8Array;
  encryptMetadata: EncryptMetadata;
  metadata?: Metadata;
}
interface DecryptDataPayload {
  profile: string;
  keySource: KeySource;
  ciphertext: Uint8Array;
  decryptMetadata: DecryptMetadata;
  metadata?: Metadata;
}
declare class CryptoBrokerClient {
  private client;
  private healthClient;
  private devClient;
  private address;
  private conn;
  private breakerConfig;
  constructor(opts?: CreateCryptoBrokerClientParams);
  static NewLibrary(opts?: CreateCryptoBrokerClientParams): Promise<CryptoBrokerClient>;
  benchmarkData(payload: BenchmarkPayload): Promise<BenchmarkResponse>;
  hashData(payload: HashDataPayload): Promise<HashDataResponse>;
  signCertificate(payload: SignCertificatePayload): Promise<SignCertificateResponse>;
  encryptData(payload: EncryptDataPayload): Promise<EncryptDataResponse>;
  decryptData(payload: DecryptDataPayload): Promise<DecryptDataResponse>;
  healthData(): Promise<HealthCheckResponse>;
}
declare const VERSION: any;
declare const GIT_HASH: any;
//#endregion
export { BenchmarkPayload, ConnectOptions, CryptoBrokerClient, DecryptDataPayload, EncryptDataPayload, GIT_HASH, HashOutputFormat as HashDataOutputFormat, HashDataPayload, Metadata, SignOutputFormat as SignCertificateOutputFormat, SignCertificatePayload, TraceContext, VERSION };
//# sourceMappingURL=client.d.cts.map