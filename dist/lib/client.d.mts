import * as grpc from "@grpc/grpc-js";

//#region node_modules/long/types.d.ts
// Common type definitions for both the ESM and UMD variants. The ESM variant
// reexports the Long class as its default export, whereas the UMD variant makes
// the Long class a whole-module export with a global variable fallback.
type LongLike = Long$1 | number | bigint | string | {
  low: number;
  high: number;
  unsigned: boolean;
};
declare class Long$1 {
  /**
   * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as signed integers. See the from* functions below for more convenient ways of constructing Longs.
   */
  constructor(low: number, high?: number, unsigned?: boolean);
  /**
   * Maximum unsigned value.
   */
  static MAX_UNSIGNED_VALUE: Long$1;
  /**
   * Maximum signed value.
   */
  static MAX_VALUE: Long$1;
  /**
   * Minimum signed value.
   */
  static MIN_VALUE: Long$1;
  /**
   * Signed negative one.
   */
  static NEG_ONE: Long$1;
  /**
   * Signed one.
   */
  static ONE: Long$1;
  /**
   * Unsigned one.
   */
  static UONE: Long$1;
  /**
   * Unsigned zero.
   */
  static UZERO: Long$1;
  /**
   * Signed zero
   */
  static ZERO: Long$1;
  /**
   * The high 32 bits as a signed value.
   */
  high: number;
  /**
   * The low 32 bits as a signed value.
   */
  low: number;
  /**
   * Whether unsigned or not.
   */
  unsigned: boolean;
  /**
   * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is assumed to use 32 bits.
   */
  static fromBits(lowBits: number, highBits: number, unsigned?: boolean): Long$1;
  /**
   * Returns a Long representing the given 32 bit integer value.
   */
  static fromInt(value: number, unsigned?: boolean): Long$1;
  /**
   * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
   */
  static fromNumber(value: number, unsigned?: boolean): Long$1;
  /**
   * Returns a Long representing the given big integer value.
   */
  static fromBigInt(value: bigint, unsigned?: boolean): Long$1;
  /**
   * Returns a Long representation of the given string, written using the specified radix.
   */
  static fromString(str: string, unsigned?: boolean | number, radix?: number): Long$1;
  /**
   * Creates a Long from its byte representation.
   */
  static fromBytes(bytes: number[], unsigned?: boolean, le?: boolean): Long$1;
  /**
   * Creates a Long from its little endian byte representation.
   */
  static fromBytesLE(bytes: number[], unsigned?: boolean): Long$1;
  /**
   * Creates a Long from its big endian byte representation.
   */
  static fromBytesBE(bytes: number[], unsigned?: boolean): Long$1;
  /**
   * Tests if the specified object is a Long.
   */
  static isLong(obj: any): obj is Long$1;
  /**
   * Converts the specified value to a Long.
   */
  static fromValue(val: LongLike, unsigned?: boolean): Long$1;
  /**
   * Returns the sum of this and the specified Long.
   */
  add(addend: LongLike): Long$1;
  /**
   * Returns the bitwise AND of this Long and the specified.
   */
  and(other: LongLike): Long$1;
  /**
   * Compares this Long's value with the specified's.
   */
  compare(other: LongLike): number;
  /**
   * Compares this Long's value with the specified's.
   */
  comp(other: LongLike): number;
  /**
   * Returns this Long divided by the specified.
   */
  divide(divisor: LongLike): Long$1;
  /**
   * Returns this Long divided by the specified.
   */
  div(divisor: LongLike): Long$1;
  /**
   * Tests if this Long's value equals the specified's.
   */
  equals(other: LongLike): boolean;
  /**
   * Tests if this Long's value equals the specified's.
   */
  eq(other: LongLike): boolean;
  /**
   * Gets the high 32 bits as a signed integer.
   */
  getHighBits(): number;
  /**
   * Gets the high 32 bits as an unsigned integer.
   */
  getHighBitsUnsigned(): number;
  /**
   * Gets the low 32 bits as a signed integer.
   */
  getLowBits(): number;
  /**
   * Gets the low 32 bits as an unsigned integer.
   */
  getLowBitsUnsigned(): number;
  /**
   * Gets the number of bits needed to represent the absolute value of this Long.
   */
  getNumBitsAbs(): number;
  /**
   * Tests if this Long's value is greater than the specified's.
   */
  greaterThan(other: LongLike): boolean;
  /**
   * Tests if this Long's value is greater than the specified's.
   */
  gt(other: LongLike): boolean;
  /**
   * Tests if this Long's value is greater than or equal the specified's.
   */
  greaterThanOrEqual(other: LongLike): boolean;
  /**
   * Tests if this Long's value is greater than or equal the specified's.
   */
  gte(other: LongLike): boolean;
  /**
   * Tests if this Long's value is greater than or equal the specified's.
   */
  ge(other: LongLike): boolean;
  /**
   * Tests if this Long's value is even.
   */
  isEven(): boolean;
  /**
   * Tests if this Long's value is negative.
   */
  isNegative(): boolean;
  /**
   * Tests if this Long's value is odd.
   */
  isOdd(): boolean;
  /**
   * Tests if this Long's value is positive or zero.
   */
  isPositive(): boolean;
  /**
   * Tests if this Long can be safely represented as a JavaScript number.
   */
  isSafeInteger(): boolean;
  /**
   * Tests if this Long's value equals zero.
   */
  isZero(): boolean;
  /**
   * Tests if this Long's value equals zero.
   */
  eqz(): boolean;
  /**
   * Tests if this Long's value is less than the specified's.
   */
  lessThan(other: LongLike): boolean;
  /**
   * Tests if this Long's value is less than the specified's.
   */
  lt(other: LongLike): boolean;
  /**
   * Tests if this Long's value is less than or equal the specified's.
   */
  lessThanOrEqual(other: LongLike): boolean;
  /**
   * Tests if this Long's value is less than or equal the specified's.
   */
  lte(other: LongLike): boolean;
  /**
   * Tests if this Long's value is less than or equal the specified's.
   */
  le(other: LongLike): boolean;
  /**
   * Returns this Long modulo the specified.
   */
  modulo(other: LongLike): Long$1;
  /**
   * Returns this Long modulo the specified.
   */
  mod(other: LongLike): Long$1;
  /**
   * Returns this Long modulo the specified.
   */
  rem(other: LongLike): Long$1;
  /**
   * Returns the product of this and the specified Long.
   */
  multiply(multiplier: LongLike): Long$1;
  /**
   * Returns the product of this and the specified Long.
   */
  mul(multiplier: LongLike): Long$1;
  /**
   * Negates this Long's value.
   */
  negate(): Long$1;
  /**
   * Negates this Long's value.
   */
  neg(): Long$1;
  /**
   * Returns the bitwise NOT of this Long.
   */
  not(): Long$1;
  /**
   * Returns count leading zeros of this Long.
   */
  countLeadingZeros(): number;
  /**
   * Returns count leading zeros of this Long.
   */
  clz(): number;
  /**
   * Returns count trailing zeros of this Long.
   */
  countTrailingZeros(): number;
  /**
   * Returns count trailing zeros of this Long.
   */
  ctz(): number;
  /**
   * Tests if this Long's value differs from the specified's.
   */
  notEquals(other: LongLike): boolean;
  /**
   * Tests if this Long's value differs from the specified's.
   */
  neq(other: LongLike): boolean;
  /**
   * Tests if this Long's value differs from the specified's.
   */
  ne(other: LongLike): boolean;
  /**
   * Returns the bitwise OR of this Long and the specified.
   */
  or(other: LongLike): Long$1;
  /**
   * Returns this Long with bits shifted to the left by the given amount.
   */
  shiftLeft(numBits: number | Long$1): Long$1;
  /**
   * Returns this Long with bits shifted to the left by the given amount.
   */
  shl(numBits: number | Long$1): Long$1;
  /**
   * Returns this Long with bits arithmetically shifted to the right by the given amount.
   */
  shiftRight(numBits: number | Long$1): Long$1;
  /**
   * Returns this Long with bits arithmetically shifted to the right by the given amount.
   */
  shr(numBits: number | Long$1): Long$1;
  /**
   * Returns this Long with bits logically shifted to the right by the given amount.
   */
  shiftRightUnsigned(numBits: number | Long$1): Long$1;
  /**
   * Returns this Long with bits logically shifted to the right by the given amount.
   */
  shru(numBits: number | Long$1): Long$1;
  /**
   * Returns this Long with bits logically shifted to the right by the given amount.
   */
  shr_u(numBits: number | Long$1): Long$1;
  /**
   * Returns this Long with bits rotated to the left by the given amount.
   */
  rotateLeft(numBits: number | Long$1): Long$1;
  /**
   * Returns this Long with bits rotated to the left by the given amount.
   */
  rotl(numBits: number | Long$1): Long$1;
  /**
   * Returns this Long with bits rotated to the right by the given amount.
   */
  rotateRight(numBits: number | Long$1): Long$1;
  /**
   * Returns this Long with bits rotated to the right by the given amount.
   */
  rotr(numBits: number | Long$1): Long$1;
  /**
   * Returns the difference of this and the specified Long.
   */
  subtract(subtrahend: LongLike): Long$1;
  /**
   * Returns the difference of this and the specified Long.
   */
  sub(subtrahend: LongLike): Long$1;
  /**
   * Converts the Long to a big integer.
   */
  toBigInt(): bigint;
  /**
   * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
   */
  toInt(): number;
  /**
   * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
   */
  toNumber(): number;
  /**
   * Converts this Long to its byte representation.
   */
  toBytes(le?: boolean): number[];
  /**
   * Converts this Long to its little endian byte representation.
   */
  toBytesLE(): number[];
  /**
   * Converts this Long to its big endian byte representation.
   */
  toBytesBE(): number[];
  /**
   * Converts this Long to signed.
   */
  toSigned(): Long$1;
  /**
   * Converts the Long to a string written in the specified radix.
   */
  toString(radix?: number): string;
  /**
   * Converts this Long to unsigned.
   */
  toUnsigned(): Long$1;
  /**
   * Returns the bitwise XOR of this Long and the given one.
   */
  xor(other: LongLike): Long$1;
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
   * matching field number in the EndGroup tag.
   */
  skip(wireType: WireType, fieldNo?: number): Uint8Array;
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
/** Trace context for manual propagation */
interface TraceContext$1 {
  traceId: string;
  spanId: string;
  traceFlags: string;
  traceState: string;
  correlationId: string;
}
/** Metadata shared across all methods */
interface Metadata$1 {
  id: string;
  createdAt: string;
  traceContext?: TraceContext$1 | undefined;
}
/** Response for a Benchmark Request */
interface BenchmarkResponse {
  benchmarkResults: string;
  metadata: Metadata$1 | undefined;
}
/** Response to a Hash Request */
interface HashResponse {
  hashValue: string;
  hashAlgorithm: string;
  metadata: Metadata$1 | undefined;
}
/** Response to a Sign Request */
interface SignResponse {
  signedCertificate: string;
  metadata: Metadata$1 | undefined;
}
declare const TraceContext$1: MessageFns$1<TraceContext$1>;
declare const Metadata$1: MessageFns$1<Metadata$1>;
declare const BenchmarkResponse: MessageFns$1<BenchmarkResponse>;
declare const HashResponse: MessageFns$1<HashResponse>;
declare const SignResponse: MessageFns$1<SignResponse>;
type Builtin$1 = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial$1<T> = T extends Builtin$1 ? T : T extends Long$1 ? string | number | Long$1 : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial$1<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial$1<U>> : T extends {} ? { [K in keyof T]?: DeepPartial$1<T[K]> } : Partial<T>;
type KeysOfUnion$1<T> = T extends T ? keyof T : never;
type Exact$1<P, I extends P> = P extends Builtin$1 ? P : P & { [K in keyof P]: Exact$1<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion$1<P>>]: never };
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
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> } : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin ? P : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };
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
type CreateCryptoBrokerClientParams = {
  options?: grpc.ClientOptions;
};
interface TraceContext {
  traceId: string;
  spanId: string;
  traceFlags: string;
  traceState: string;
  correlationId: string;
}
interface Metadata {
  id?: string;
  createdAt?: string;
  traceContext?: TraceContext;
}
interface BenchmarkPayload {
  metadata?: Metadata;
}
interface HashPayload {
  profile: string;
  input: Uint8Array;
  metadata?: Metadata;
}
interface SignPayload {
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
declare enum CertEncoding {
  B64 = "B64",
  PEM = "PEM"
}
type CertOptions = {
  encoding: CertEncoding;
};
declare class CryptoBrokerClient {
  private client;
  private healthClient;
  private address;
  private conn;
  constructor(opts?: CreateCryptoBrokerClientParams);
  static NewLibrary(opts?: CreateCryptoBrokerClientParams): Promise<CryptoBrokerClient>;
  benchmarkData(payload: BenchmarkPayload): Promise<BenchmarkResponse>;
  hashData(payload: HashPayload): Promise<HashResponse>;
  signCertificate(payload: SignPayload, options?: CertOptions): Promise<SignResponse>;
  healthData(): Promise<HealthCheckResponse>;
}
declare const VERSION: any;
declare const GIT_HASH: any;
//#endregion
export { BenchmarkPayload, CertEncoding, CryptoBrokerClient, GIT_HASH, HashPayload, Metadata, SignPayload, TraceContext, VERSION };
//# sourceMappingURL=client.d.mts.map