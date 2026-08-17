Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
require("reflect-metadata");
let _grpc_grpc_js = require("@grpc/grpc-js");
_grpc_grpc_js = __toESM(_grpc_grpc_js, 1);
let crypto = require("crypto");
let opossum = require("opossum");
opossum = __toESM(opossum, 1);
//#region src/lib/conf/service_config.ts
const defaultServiceConfig = { methodConfig: [{
	name: [{}],
	retryPolicy: {
		maxAttempts: 5,
		initialBackoff: "0.5s",
		maxBackoff: "5s",
		backoffMultiplier: 2,
		retryableStatusCodes: [
			"UNAVAILABLE",
			"RESOURCE_EXHAUSTED",
			"ABORTED"
		]
	}
}] };
//#endregion
//#region src/lib/conf/circuitbreaker_config.ts
const circuitBreakerConfigFactory = (override) => {
	const defaultConfig = {
		enabled: true,
		name: "crypto-grpc",
		rollingCountTimeout: 12e4,
		timeout: 3e4,
		errorThresholdPercentage: 25,
		resetTimeout: 5e3,
		failureStatusCodes: [
			14,
			8,
			10
		]
	};
	const failureStatusCodes = override?.failureStatusCodes ?? defaultConfig.failureStatusCodes ?? [];
	return {
		...defaultConfig,
		...override,
		errorFilter: (err) => {
			return typeof err === "object" && "code" in err && typeof err.code === "number" && !failureStatusCodes.includes(err.code);
		}
	};
};
//#endregion
//#region node_modules/@bufbuild/protobuf/dist/esm/wire/varint.js
/**
* Read a 64 bit varint as two JS numbers.
*
* Returns tuple:
* [0]: low bits
* [1]: high bits
*
* Copyright 2008 Google Inc.  All rights reserved.
*
* See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L175
*/
function varint64read() {
	let lowBits = 0;
	let highBits = 0;
	for (let shift = 0; shift < 28; shift += 7) {
		let b = this.buf[this.pos++];
		lowBits |= (b & 127) << shift;
		if ((b & 128) == 0) {
			this.assertBounds();
			return [lowBits, highBits];
		}
	}
	let middleByte = this.buf[this.pos++];
	lowBits |= (middleByte & 15) << 28;
	highBits = (middleByte & 112) >> 4;
	if ((middleByte & 128) == 0) {
		this.assertBounds();
		return [lowBits, highBits];
	}
	for (let shift = 3; shift <= 31; shift += 7) {
		let b = this.buf[this.pos++];
		highBits |= (b & 127) << shift;
		if ((b & 128) == 0) {
			this.assertBounds();
			return [lowBits, highBits];
		}
	}
	throw new Error("invalid varint");
}
/**
* Write a 64 bit varint, given as two JS numbers, to the given bytes array.
*
* Copyright 2008 Google Inc.  All rights reserved.
*
* See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/writer.js#L344
*/
function varint64write(lo, hi, bytes) {
	for (let i = 0; i < 28; i = i + 7) {
		const shift = lo >>> i;
		const hasNext = !(shift >>> 7 == 0 && hi == 0);
		const byte = (hasNext ? shift | 128 : shift) & 255;
		bytes.push(byte);
		if (!hasNext) return;
	}
	const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
	const hasMoreBits = !(hi >> 3 == 0);
	bytes.push((hasMoreBits ? splitBits | 128 : splitBits) & 255);
	if (!hasMoreBits) return;
	for (let i = 3; i < 31; i = i + 7) {
		const shift = hi >>> i;
		const hasNext = !(shift >>> 7 == 0);
		const byte = (hasNext ? shift | 128 : shift) & 255;
		bytes.push(byte);
		if (!hasNext) return;
	}
	bytes.push(hi >>> 31 & 1);
}
const TWO_PWR_32_DBL = 4294967296;
/**
* Parse decimal string of 64 bit integer value as two JS numbers.
*
* Copyright 2008 Google Inc.  All rights reserved.
*
* See https://github.com/protocolbuffers/protobuf-javascript/blob/a428c58273abad07c66071d9753bc4d1289de426/experimental/runtime/int64.js#L10
*/
function int64FromString(dec) {
	const minus = dec[0] === "-";
	if (minus) dec = dec.slice(1);
	const base = 1e6;
	let lowBits = 0;
	let highBits = 0;
	function add1e6digit(begin, end) {
		const digit1e6 = Number(dec.slice(begin, end));
		highBits *= base;
		lowBits = lowBits * base + digit1e6;
		if (lowBits >= TWO_PWR_32_DBL) {
			highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
			lowBits = lowBits % TWO_PWR_32_DBL;
		}
	}
	add1e6digit(-24, -18);
	add1e6digit(-18, -12);
	add1e6digit(-12, -6);
	add1e6digit(-6);
	return minus ? negate(lowBits, highBits) : newBits(lowBits, highBits);
}
/**
* Losslessly converts a 64-bit signed integer in 32:32 split representation
* into a decimal string.
*
* Copyright 2008 Google Inc.  All rights reserved.
*
* See https://github.com/protocolbuffers/protobuf-javascript/blob/a428c58273abad07c66071d9753bc4d1289de426/experimental/runtime/int64.js#L10
*/
function int64ToString(lo, hi) {
	let bits = newBits(lo, hi);
	const negative = bits.hi & 2147483648;
	if (negative) bits = negate(bits.lo, bits.hi);
	const result = uInt64ToString(bits.lo, bits.hi);
	return negative ? "-" + result : result;
}
/**
* Losslessly converts a 64-bit unsigned integer in 32:32 split representation
* into a decimal string.
*
* Copyright 2008 Google Inc.  All rights reserved.
*
* See https://github.com/protocolbuffers/protobuf-javascript/blob/a428c58273abad07c66071d9753bc4d1289de426/experimental/runtime/int64.js#L10
*/
function uInt64ToString(lo, hi) {
	({lo, hi} = toUnsigned(lo, hi));
	if (hi <= 2097151) return String(TWO_PWR_32_DBL * hi + lo);
	const low = lo & 16777215;
	const mid = (lo >>> 24 | hi << 8) & 16777215;
	const high = hi >> 16 & 65535;
	let digitA = low + mid * 6777216 + high * 6710656;
	let digitB = mid + high * 8147497;
	let digitC = high * 2;
	const base = 1e7;
	if (digitA >= base) {
		digitB += Math.floor(digitA / base);
		digitA %= base;
	}
	if (digitB >= base) {
		digitC += Math.floor(digitB / base);
		digitB %= base;
	}
	return digitC.toString() + decimalFrom1e7WithLeadingZeros(digitB) + decimalFrom1e7WithLeadingZeros(digitA);
}
function toUnsigned(lo, hi) {
	return {
		lo: lo >>> 0,
		hi: hi >>> 0
	};
}
function newBits(lo, hi) {
	return {
		lo: lo | 0,
		hi: hi | 0
	};
}
/**
* Returns two's compliment negation of input.
* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Signed_32-bit_integers
*/
function negate(lowBits, highBits) {
	highBits = ~highBits;
	if (lowBits) lowBits = ~lowBits + 1;
	else highBits += 1;
	return newBits(lowBits, highBits);
}
/**
* Returns decimal representation of digit1e7 with leading zeros.
*/
const decimalFrom1e7WithLeadingZeros = (digit1e7) => {
	const partial = String(digit1e7);
	return "0000000".slice(partial.length) + partial;
};
/**
* Write a 32 bit varint, signed or unsigned. Same as `varint64write(0, value, bytes)`
*
* Copyright 2008 Google Inc.  All rights reserved.
*
* See https://github.com/protocolbuffers/protobuf/blob/1b18833f4f2a2f681f4e4a25cdf3b0a43115ec26/js/binary/encoder.js#L144
*/
function varint32write(value, bytes) {
	if (value >= 0) {
		while (value > 127) {
			bytes.push(value & 127 | 128);
			value = value >>> 7;
		}
		bytes.push(value);
	} else {
		for (let i = 0; i < 9; i++) {
			bytes.push(value & 127 | 128);
			value = value >> 7;
		}
		bytes.push(1);
	}
}
/**
* Read an unsigned 32 bit varint.
*
* See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L220
*/
function varint32read() {
	let b = this.buf[this.pos++];
	let result = b & 127;
	if ((b & 128) == 0) {
		this.assertBounds();
		return result;
	}
	b = this.buf[this.pos++];
	result |= (b & 127) << 7;
	if ((b & 128) == 0) {
		this.assertBounds();
		return result;
	}
	b = this.buf[this.pos++];
	result |= (b & 127) << 14;
	if ((b & 128) == 0) {
		this.assertBounds();
		return result;
	}
	b = this.buf[this.pos++];
	result |= (b & 127) << 21;
	if ((b & 128) == 0) {
		this.assertBounds();
		return result;
	}
	b = this.buf[this.pos++];
	result |= (b & 15) << 28;
	for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++) b = this.buf[this.pos++];
	if ((b & 128) != 0) throw new Error("invalid varint");
	this.assertBounds();
	return result >>> 0;
}
//#endregion
//#region node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js
/**
* Int64Support for the current environment.
*/
const protoInt64 = /*@__PURE__*/ makeInt64Support();
function makeInt64Support() {
	const dv = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
	if (typeof BigInt === "function" && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function" && (!!globalThis.Deno || !!globalThis.Bun || typeof process != "object" || typeof process.env != "object" || process.env.BUF_BIGINT_DISABLE !== "1")) {
		const MIN = BigInt("-9223372036854775808");
		const MAX = BigInt("9223372036854775807");
		const UMIN = BigInt("0");
		const UMAX = BigInt("18446744073709551615");
		return {
			zero: BigInt(0),
			supported: true,
			parse(value) {
				const bi = typeof value == "bigint" ? value : BigInt(value);
				if (bi > MAX || bi < MIN) throw new Error(`invalid int64: ${value}`);
				return bi;
			},
			uParse(value) {
				const bi = typeof value == "bigint" ? value : BigInt(value);
				if (bi > UMAX || bi < UMIN) throw new Error(`invalid uint64: ${value}`);
				return bi;
			},
			enc(value) {
				dv.setBigInt64(0, this.parse(value), true);
				return {
					lo: dv.getInt32(0, true),
					hi: dv.getInt32(4, true)
				};
			},
			uEnc(value) {
				dv.setBigInt64(0, this.uParse(value), true);
				return {
					lo: dv.getInt32(0, true),
					hi: dv.getInt32(4, true)
				};
			},
			dec(lo, hi) {
				dv.setInt32(0, lo, true);
				dv.setInt32(4, hi, true);
				return dv.getBigInt64(0, true);
			},
			uDec(lo, hi) {
				dv.setInt32(0, lo, true);
				dv.setInt32(4, hi, true);
				return dv.getBigUint64(0, true);
			}
		};
	}
	return {
		zero: "0",
		supported: false,
		parse(value) {
			if (typeof value != "string") value = value.toString();
			assertInt64String(value);
			return value;
		},
		uParse(value) {
			if (typeof value != "string") value = value.toString();
			assertUInt64String(value);
			return value;
		},
		enc(value) {
			if (typeof value != "string") value = value.toString();
			assertInt64String(value);
			return int64FromString(value);
		},
		uEnc(value) {
			if (typeof value != "string") value = value.toString();
			assertUInt64String(value);
			return int64FromString(value);
		},
		dec(lo, hi) {
			return int64ToString(lo, hi);
		},
		uDec(lo, hi) {
			return uInt64ToString(lo, hi);
		}
	};
}
function assertInt64String(value) {
	if (!/^-?[0-9]+$/.test(value)) throw new Error("invalid int64: " + value);
}
function assertUInt64String(value) {
	if (!/^[0-9]+$/.test(value)) throw new Error("invalid uint64: " + value);
}
//#endregion
//#region node_modules/@bufbuild/protobuf/dist/esm/wire/text-encoding.js
const symbol = Symbol.for("@bufbuild/protobuf/text-encoding");
function getTextEncoding() {
	if (globalThis[symbol] == void 0) {
		const te = new globalThis.TextEncoder();
		const td = new globalThis.TextDecoder();
		let tdStrict;
		globalThis[symbol] = {
			encodeUtf8(text) {
				return te.encode(text);
			},
			decodeUtf8(bytes, strict) {
				if (strict) {
					if (tdStrict === void 0) tdStrict = new globalThis.TextDecoder("utf-8", { fatal: true });
					return tdStrict.decode(bytes);
				}
				return td.decode(bytes);
			},
			checkUtf8(text) {
				try {
					return true;
				} catch (_) {
					return false;
				}
			}
		};
	}
	return globalThis[symbol];
}
//#endregion
//#region node_modules/@bufbuild/protobuf/dist/esm/wire/binary-encoding.js
/**
* Protobuf binary format wire types.
*
* A wire type provides just enough information to find the length of the
* following value.
*
* See https://developers.google.com/protocol-buffers/docs/encoding#structure
*/
var WireType;
(function(WireType) {
	/**
	* Used for int32, int64, uint32, uint64, sint32, sint64, bool, enum
	*/
	WireType[WireType["Varint"] = 0] = "Varint";
	/**
	* Used for fixed64, sfixed64, double.
	* Always 8 bytes with little-endian byte order.
	*/
	WireType[WireType["Bit64"] = 1] = "Bit64";
	/**
	* Used for string, bytes, embedded messages, packed repeated fields
	*
	* Only repeated numeric types (types which use the varint, 32-bit,
	* or 64-bit wire types) can be packed. In proto3, such fields are
	* packed by default.
	*/
	WireType[WireType["LengthDelimited"] = 2] = "LengthDelimited";
	/**
	* Start of a tag-delimited aggregate, such as a proto2 group, or a message
	* in editions with message_encoding = DELIMITED.
	*/
	WireType[WireType["StartGroup"] = 3] = "StartGroup";
	/**
	* End of a tag-delimited aggregate.
	*/
	WireType[WireType["EndGroup"] = 4] = "EndGroup";
	/**
	* Used for fixed32, sfixed32, float.
	* Always 4 bytes with little-endian byte order.
	*/
	WireType[WireType["Bit32"] = 5] = "Bit32";
})(WireType || (WireType = {}));
var BinaryWriter = class {
	constructor(encodeUtf8 = getTextEncoding().encodeUtf8) {
		this.encodeUtf8 = encodeUtf8;
		/**
		* Previous fork states.
		*/
		this.stack = [];
		this.chunks = [];
		this.buf = [];
	}
	/**
	* Return all bytes written and reset this writer.
	*/
	finish() {
		if (this.buf.length) {
			this.chunks.push(new Uint8Array(this.buf));
			this.buf = [];
		}
		let len = 0;
		for (let i = 0; i < this.chunks.length; i++) len += this.chunks[i].length;
		let bytes = new Uint8Array(len);
		let offset = 0;
		for (let i = 0; i < this.chunks.length; i++) {
			bytes.set(this.chunks[i], offset);
			offset += this.chunks[i].length;
		}
		this.chunks = [];
		return bytes;
	}
	/**
	* Start a new fork for length-delimited data like a message
	* or a packed repeated field.
	*
	* Must be joined later with `join()`.
	*/
	fork() {
		this.stack.push({
			chunks: this.chunks,
			buf: this.buf
		});
		this.chunks = [];
		this.buf = [];
		return this;
	}
	/**
	* Join the last fork. Write its length and bytes, then
	* return to the previous state.
	*/
	join() {
		let chunk = this.finish();
		let prev = this.stack.pop();
		if (!prev) throw new Error("invalid state, fork stack empty");
		this.chunks = prev.chunks;
		this.buf = prev.buf;
		this.uint32(chunk.byteLength);
		return this.raw(chunk);
	}
	/**
	* Writes a tag (field number and wire type).
	*
	* Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
	*
	* Generated code should compute the tag ahead of time and call `uint32()`.
	*/
	tag(fieldNo, type) {
		return this.uint32((fieldNo << 3 | type) >>> 0);
	}
	/**
	* Write a chunk of raw bytes.
	*/
	raw(chunk) {
		if (this.buf.length) {
			this.chunks.push(new Uint8Array(this.buf));
			this.buf = [];
		}
		this.chunks.push(chunk);
		return this;
	}
	/**
	* Write a `uint32` value, an unsigned 32 bit varint.
	*/
	uint32(value) {
		assertUInt32(value);
		while (value > 127) {
			this.buf.push(value & 127 | 128);
			value = value >>> 7;
		}
		this.buf.push(value);
		return this;
	}
	/**
	* Write a `int32` value, a signed 32 bit varint.
	*/
	int32(value) {
		assertInt32(value);
		varint32write(value, this.buf);
		return this;
	}
	/**
	* Write a `bool` value, a varint.
	*/
	bool(value) {
		this.buf.push(value ? 1 : 0);
		return this;
	}
	/**
	* Write a `bytes` value, length-delimited arbitrary data.
	*/
	bytes(value) {
		this.uint32(value.byteLength);
		return this.raw(value);
	}
	/**
	* Write a `string` value, length-delimited data converted to UTF-8 text.
	*/
	string(value) {
		let chunk = this.encodeUtf8(value);
		this.uint32(chunk.byteLength);
		return this.raw(chunk);
	}
	/**
	* Write a `float` value, 32-bit floating point number.
	*/
	float(value) {
		assertFloat32(value);
		let chunk = /* @__PURE__ */ new Uint8Array(4);
		new DataView(chunk.buffer).setFloat32(0, value, true);
		return this.raw(chunk);
	}
	/**
	* Write a `double` value, a 64-bit floating point number.
	*/
	double(value) {
		let chunk = /* @__PURE__ */ new Uint8Array(8);
		new DataView(chunk.buffer).setFloat64(0, value, true);
		return this.raw(chunk);
	}
	/**
	* Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
	*/
	fixed32(value) {
		assertUInt32(value);
		let chunk = /* @__PURE__ */ new Uint8Array(4);
		new DataView(chunk.buffer).setUint32(0, value, true);
		return this.raw(chunk);
	}
	/**
	* Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
	*/
	sfixed32(value) {
		assertInt32(value);
		let chunk = /* @__PURE__ */ new Uint8Array(4);
		new DataView(chunk.buffer).setInt32(0, value, true);
		return this.raw(chunk);
	}
	/**
	* Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
	*/
	sint32(value) {
		assertInt32(value);
		value = (value << 1 ^ value >> 31) >>> 0;
		varint32write(value, this.buf);
		return this;
	}
	/**
	* Write a `sfixed64` value, a signed, fixed-length 64-bit integer.
	*/
	sfixed64(value) {
		let chunk = /* @__PURE__ */ new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.enc(value);
		view.setInt32(0, tc.lo, true);
		view.setInt32(4, tc.hi, true);
		return this.raw(chunk);
	}
	/**
	* Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
	*/
	fixed64(value) {
		let chunk = /* @__PURE__ */ new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.uEnc(value);
		view.setInt32(0, tc.lo, true);
		view.setInt32(4, tc.hi, true);
		return this.raw(chunk);
	}
	/**
	* Write a `int64` value, a signed 64-bit varint.
	*/
	int64(value) {
		let tc = protoInt64.enc(value);
		varint64write(tc.lo, tc.hi, this.buf);
		return this;
	}
	/**
	* Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
	*/
	sint64(value) {
		const tc = protoInt64.enc(value), sign = tc.hi >> 31;
		varint64write(tc.lo << 1 ^ sign, (tc.hi << 1 | tc.lo >>> 31) ^ sign, this.buf);
		return this;
	}
	/**
	* Write a `uint64` value, an unsigned 64-bit varint.
	*/
	uint64(value) {
		const tc = protoInt64.uEnc(value);
		varint64write(tc.lo, tc.hi, this.buf);
		return this;
	}
};
var BinaryReader = class {
	constructor(buf, decodeUtf8 = getTextEncoding().decodeUtf8) {
		this.decodeUtf8 = decodeUtf8;
		this.varint64 = varint64read;
		/**
		* Read a `uint32` field, an unsigned 32 bit varint.
		*/
		this.uint32 = varint32read;
		this.buf = buf;
		this.len = buf.length;
		this.pos = 0;
		this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
	}
	/**
	* Reads a tag - field number and wire type. Tags are uint32 varints; values
	* that do not fit in uint32 are rejected.
	*/
	tag() {
		const start = this.pos;
		const tag = this.uint32();
		const bytesRead = this.pos - start;
		if (bytesRead > 5 || bytesRead == 5 && this.buf[this.pos - 1] > 15) throw new Error("illegal tag: varint overflows uint32");
		const fieldNo = tag >>> 3;
		const wireType = tag & 7;
		if (fieldNo <= 0 || wireType > 5) throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
		return [fieldNo, wireType];
	}
	/**
	* Skip one element and return the skipped data.
	*
	* When skipping StartGroup, provide the tags field number to check for
	* matching field number in the EndGroup tag. Recursion into nested groups
	* is guarded by the `recursionLimit` argument: When the limit is reached,
	* this method throws.
	*/
	skip(wireType, fieldNo, recursionLimit = 100) {
		let start = this.pos;
		switch (wireType) {
			case WireType.Varint:
				while (this.buf[this.pos++] & 128);
				break;
			case WireType.Bit64: this.pos += 4;
			case WireType.Bit32:
				this.pos += 4;
				break;
			case WireType.LengthDelimited:
				let len = this.uint32();
				this.pos += len;
				break;
			case WireType.StartGroup:
				if (recursionLimit <= 0) throw new Error("maximum recursion depth reached");
				for (;;) {
					const [fn, wt] = this.tag();
					if (wt === WireType.EndGroup) {
						if (fieldNo !== void 0 && fn !== fieldNo) throw new Error("invalid end group tag");
						break;
					}
					this.skip(wt, fn, recursionLimit - 1);
				}
				break;
			default: throw new Error("cant skip wire type " + wireType);
		}
		this.assertBounds();
		return this.buf.subarray(start, this.pos);
	}
	/**
	* Throws error if position in byte array is out of range.
	*/
	assertBounds() {
		if (this.pos > this.len) throw new RangeError("premature EOF");
	}
	/**
	* Read a `int32` field, a signed 32 bit varint.
	*/
	int32() {
		return this.uint32() | 0;
	}
	/**
	* Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
	*/
	sint32() {
		let zze = this.uint32();
		return zze >>> 1 ^ -(zze & 1);
	}
	/**
	* Read a `int64` field, a signed 64-bit varint.
	*/
	int64() {
		return protoInt64.dec(...this.varint64());
	}
	/**
	* Read a `uint64` field, an unsigned 64-bit varint.
	*/
	uint64() {
		return protoInt64.uDec(...this.varint64());
	}
	/**
	* Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
	*/
	sint64() {
		let [lo, hi] = this.varint64();
		let s = -(lo & 1);
		lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
		hi = hi >>> 1 ^ s;
		return protoInt64.dec(lo, hi);
	}
	/**
	* Read a `bool` field, a variant.
	*/
	bool() {
		let [lo, hi] = this.varint64();
		return lo !== 0 || hi !== 0;
	}
	/**
	* Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
	*/
	fixed32() {
		return this.view.getUint32((this.pos += 4) - 4, true);
	}
	/**
	* Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
	*/
	sfixed32() {
		return this.view.getInt32((this.pos += 4) - 4, true);
	}
	/**
	* Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
	*/
	fixed64() {
		return protoInt64.uDec(this.sfixed32(), this.sfixed32());
	}
	/**
	* Read a `fixed64` field, a signed, fixed-length 64-bit integer.
	*/
	sfixed64() {
		return protoInt64.dec(this.sfixed32(), this.sfixed32());
	}
	/**
	* Read a `float` field, 32-bit floating point number.
	*/
	float() {
		return this.view.getFloat32((this.pos += 4) - 4, true);
	}
	/**
	* Read a `double` field, a 64-bit floating point number.
	*/
	double() {
		return this.view.getFloat64((this.pos += 8) - 8, true);
	}
	/**
	* Read a `bytes` field, length-delimited arbitrary data.
	*/
	bytes() {
		let len = this.uint32(), start = this.pos;
		this.pos += len;
		this.assertBounds();
		return this.buf.subarray(start, start + len);
	}
	/**
	* Read a `string` field, length-delimited data converted to UTF-8 text. If
	* `strict` is true, throw on invalid UTF-8 instead of substituting U+FFFD.
	*/
	string(strict) {
		return this.decodeUtf8(this.bytes(), strict);
	}
};
/**
* Assert a valid signed protobuf 32-bit integer as a number or string.
*/
function assertInt32(arg) {
	if (typeof arg == "string") arg = Number(arg);
	else if (typeof arg != "number") throw new Error("invalid int32: " + typeof arg);
	if (!Number.isInteger(arg) || arg > 2147483647 || arg < -2147483648) throw new Error("invalid int32: " + arg);
}
/**
* Assert a valid unsigned protobuf 32-bit integer as a number or string.
*/
function assertUInt32(arg) {
	if (typeof arg == "string") arg = Number(arg);
	else if (typeof arg != "number") throw new Error("invalid uint32: " + typeof arg);
	if (!Number.isInteger(arg) || arg > 4294967295 || arg < 0) throw new Error("invalid uint32: " + arg);
}
/**
* Assert a valid protobuf float value as a number or string.
*/
function assertFloat32(arg) {
	if (typeof arg == "string") {
		const o = arg;
		arg = Number(arg);
		if (Number.isNaN(arg) && o !== "NaN") throw new Error("invalid float32: " + o);
	} else if (typeof arg != "number") throw new Error("invalid float32: " + typeof arg);
	if (Number.isFinite(arg) && (arg > 34028234663852886e22 || arg < -34028234663852886e22)) throw new Error("invalid float32: " + arg);
}
//#endregion
//#region src/lib/proto/messages.ts
/** Output formats */
let HashOutputFormat = /* @__PURE__ */ function(HashOutputFormat) {
	HashOutputFormat[HashOutputFormat["HEX"] = 0] = "HEX";
	HashOutputFormat[HashOutputFormat["RAW"] = 1] = "RAW";
	HashOutputFormat[HashOutputFormat["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
	return HashOutputFormat;
}({});
function hashOutputFormatFromJSON(object) {
	switch (object) {
		case 0:
		case "HEX": return 0;
		case 1:
		case "RAW": return 1;
		default: return -1;
	}
}
function hashOutputFormatToJSON(object) {
	switch (object) {
		case 0: return "HEX";
		case 1: return "RAW";
		default: return "UNRECOGNIZED";
	}
}
let SignOutputFormat = /* @__PURE__ */ function(SignOutputFormat) {
	SignOutputFormat[SignOutputFormat["DER"] = 0] = "DER";
	SignOutputFormat[SignOutputFormat["PEM"] = 1] = "PEM";
	SignOutputFormat[SignOutputFormat["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
	return SignOutputFormat;
}({});
function signOutputFormatFromJSON(object) {
	switch (object) {
		case 0:
		case "DER": return 0;
		case 1:
		case "PEM": return 1;
		default: return -1;
	}
}
function signOutputFormatToJSON(object) {
	switch (object) {
		case 0: return "DER";
		case 1: return "PEM";
		default: return "UNRECOGNIZED";
	}
}
function createBaseMetadata() {
	return {
		id: "",
		traceContext: void 0
	};
}
const Metadata = {
	encode(message, writer = new BinaryWriter()) {
		if (message.id !== "") writer.uint32(10).string(message.id);
		if (message.traceContext !== void 0) TraceContext.encode(message.traceContext, writer.uint32(26).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadata();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.id = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.traceContext = TraceContext.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			id: isSet$1(object.id) ? globalThis.String(object.id) : "",
			traceContext: isSet$1(object.traceContext) ? TraceContext.fromJSON(object.traceContext) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.id !== "") obj.id = message.id;
		if (message.traceContext !== void 0) obj.traceContext = TraceContext.toJSON(message.traceContext);
		return obj;
	},
	create(base) {
		return Metadata.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseMetadata();
		message.id = object.id ?? "";
		message.traceContext = object.traceContext !== void 0 && object.traceContext !== null ? TraceContext.fromPartial(object.traceContext) : void 0;
		return message;
	}
};
function createBaseTraceContext() {
	return {
		traceId: "",
		spanId: "",
		traceFlags: "",
		traceState: "",
		correlationId: ""
	};
}
const TraceContext = {
	encode(message, writer = new BinaryWriter()) {
		if (message.traceId !== "") writer.uint32(10).string(message.traceId);
		if (message.spanId !== "") writer.uint32(18).string(message.spanId);
		if (message.traceFlags !== "") writer.uint32(26).string(message.traceFlags);
		if (message.traceState !== "") writer.uint32(34).string(message.traceState);
		if (message.correlationId !== "") writer.uint32(42).string(message.correlationId);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseTraceContext();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.traceId = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.spanId = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.traceFlags = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.traceState = reader.string();
					continue;
				case 5:
					if (tag !== 42) break;
					message.correlationId = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			traceId: isSet$1(object.traceId) ? globalThis.String(object.traceId) : "",
			spanId: isSet$1(object.spanId) ? globalThis.String(object.spanId) : "",
			traceFlags: isSet$1(object.traceFlags) ? globalThis.String(object.traceFlags) : "",
			traceState: isSet$1(object.traceState) ? globalThis.String(object.traceState) : "",
			correlationId: isSet$1(object.correlationId) ? globalThis.String(object.correlationId) : ""
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.traceId !== "") obj.traceId = message.traceId;
		if (message.spanId !== "") obj.spanId = message.spanId;
		if (message.traceFlags !== "") obj.traceFlags = message.traceFlags;
		if (message.traceState !== "") obj.traceState = message.traceState;
		if (message.correlationId !== "") obj.correlationId = message.correlationId;
		return obj;
	},
	create(base) {
		return TraceContext.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseTraceContext();
		message.traceId = object.traceId ?? "";
		message.spanId = object.spanId ?? "";
		message.traceFlags = object.traceFlags ?? "";
		message.traceState = object.traceState ?? "";
		message.correlationId = object.correlationId ?? "";
		return message;
	}
};
function createBaseKeySource() {
	return {
		keyId: void 0,
		rawKey: void 0
	};
}
const KeySource = {
	encode(message, writer = new BinaryWriter()) {
		if (message.keyId !== void 0) writer.uint32(10).string(message.keyId);
		if (message.rawKey !== void 0) writer.uint32(18).bytes(message.rawKey);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseKeySource();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.keyId = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.rawKey = reader.bytes();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			keyId: isSet$1(object.keyId) ? globalThis.String(object.keyId) : void 0,
			rawKey: isSet$1(object.rawKey) ? bytesFromBase64(object.rawKey) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.keyId !== void 0) obj.keyId = message.keyId;
		if (message.rawKey !== void 0) obj.rawKey = base64FromBytes(message.rawKey);
		return obj;
	},
	create(base) {
		return KeySource.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseKeySource();
		message.keyId = object.keyId ?? void 0;
		message.rawKey = object.rawKey ?? void 0;
		return message;
	}
};
function createBaseEncryptMetadata() {
	return {
		nonce: void 0,
		aad: void 0
	};
}
const EncryptMetadata = {
	encode(message, writer = new BinaryWriter()) {
		if (message.nonce !== void 0) writer.uint32(10).bytes(message.nonce);
		if (message.aad !== void 0) writer.uint32(18).bytes(message.aad);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseEncryptMetadata();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.nonce = reader.bytes();
					continue;
				case 2:
					if (tag !== 18) break;
					message.aad = reader.bytes();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			nonce: isSet$1(object.nonce) ? bytesFromBase64(object.nonce) : void 0,
			aad: isSet$1(object.aad) ? bytesFromBase64(object.aad) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.nonce !== void 0) obj.nonce = base64FromBytes(message.nonce);
		if (message.aad !== void 0) obj.aad = base64FromBytes(message.aad);
		return obj;
	},
	create(base) {
		return EncryptMetadata.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseEncryptMetadata();
		message.nonce = object.nonce ?? void 0;
		message.aad = object.aad ?? void 0;
		return message;
	}
};
function createBaseCipherMetadata() {
	return {
		keyId: void 0,
		nonce: void 0,
		aad: void 0,
		tag: void 0
	};
}
const CipherMetadata = {
	encode(message, writer = new BinaryWriter()) {
		if (message.keyId !== void 0) writer.uint32(10).string(message.keyId);
		if (message.nonce !== void 0) writer.uint32(18).bytes(message.nonce);
		if (message.aad !== void 0) writer.uint32(26).bytes(message.aad);
		if (message.tag !== void 0) writer.uint32(34).bytes(message.tag);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseCipherMetadata();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.keyId = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.nonce = reader.bytes();
					continue;
				case 3:
					if (tag !== 26) break;
					message.aad = reader.bytes();
					continue;
				case 4:
					if (tag !== 34) break;
					message.tag = reader.bytes();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			keyId: isSet$1(object.keyId) ? globalThis.String(object.keyId) : void 0,
			nonce: isSet$1(object.nonce) ? bytesFromBase64(object.nonce) : void 0,
			aad: isSet$1(object.aad) ? bytesFromBase64(object.aad) : void 0,
			tag: isSet$1(object.tag) ? bytesFromBase64(object.tag) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.keyId !== void 0) obj.keyId = message.keyId;
		if (message.nonce !== void 0) obj.nonce = base64FromBytes(message.nonce);
		if (message.aad !== void 0) obj.aad = base64FromBytes(message.aad);
		if (message.tag !== void 0) obj.tag = base64FromBytes(message.tag);
		return obj;
	},
	create(base) {
		return CipherMetadata.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseCipherMetadata();
		message.keyId = object.keyId ?? void 0;
		message.nonce = object.nonce ?? void 0;
		message.aad = object.aad ?? void 0;
		message.tag = object.tag ?? void 0;
		return message;
	}
};
function createBaseDecryptMetadata() {
	return {
		nonce: void 0,
		aad: void 0,
		tag: void 0
	};
}
const DecryptMetadata = {
	encode(message, writer = new BinaryWriter()) {
		if (message.nonce !== void 0) writer.uint32(10).bytes(message.nonce);
		if (message.aad !== void 0) writer.uint32(18).bytes(message.aad);
		if (message.tag !== void 0) writer.uint32(26).bytes(message.tag);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseDecryptMetadata();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.nonce = reader.bytes();
					continue;
				case 2:
					if (tag !== 18) break;
					message.aad = reader.bytes();
					continue;
				case 3:
					if (tag !== 26) break;
					message.tag = reader.bytes();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			nonce: isSet$1(object.nonce) ? bytesFromBase64(object.nonce) : void 0,
			aad: isSet$1(object.aad) ? bytesFromBase64(object.aad) : void 0,
			tag: isSet$1(object.tag) ? bytesFromBase64(object.tag) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.nonce !== void 0) obj.nonce = base64FromBytes(message.nonce);
		if (message.aad !== void 0) obj.aad = base64FromBytes(message.aad);
		if (message.tag !== void 0) obj.tag = base64FromBytes(message.tag);
		return obj;
	},
	create(base) {
		return DecryptMetadata.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseDecryptMetadata();
		message.nonce = object.nonce ?? void 0;
		message.aad = object.aad ?? void 0;
		message.tag = object.tag ?? void 0;
		return message;
	}
};
function createBaseHashDataRequest() {
	return {
		profile: "",
		input: /* @__PURE__ */ new Uint8Array(0),
		metadata: void 0,
		outputFormat: 0
	};
}
const HashDataRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.profile !== "") writer.uint32(10).string(message.profile);
		if (message.input.length !== 0) writer.uint32(18).bytes(message.input);
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(26).fork()).join();
		if (message.outputFormat !== 0) writer.uint32(32).int32(message.outputFormat);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseHashDataRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.profile = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.input = reader.bytes();
					continue;
				case 3:
					if (tag !== 26) break;
					message.metadata = Metadata.decode(reader, reader.uint32());
					continue;
				case 4:
					if (tag !== 32) break;
					message.outputFormat = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			profile: isSet$1(object.profile) ? globalThis.String(object.profile) : "",
			input: isSet$1(object.input) ? bytesFromBase64(object.input) : /* @__PURE__ */ new Uint8Array(0),
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0,
			outputFormat: isSet$1(object.outputFormat) ? hashOutputFormatFromJSON(object.outputFormat) : 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.profile !== "") obj.profile = message.profile;
		if (message.input.length !== 0) obj.input = base64FromBytes(message.input);
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		if (message.outputFormat !== 0) obj.outputFormat = hashOutputFormatToJSON(message.outputFormat);
		return obj;
	},
	create(base) {
		return HashDataRequest.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseHashDataRequest();
		message.profile = object.profile ?? "";
		message.input = object.input ?? /* @__PURE__ */ new Uint8Array(0);
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		message.outputFormat = object.outputFormat ?? 0;
		return message;
	}
};
function createBaseHashDataResponse() {
	return {
		hashAlgorithm: "",
		metadata: void 0,
		hashValueHex: void 0,
		hashValueRaw: void 0
	};
}
const HashDataResponse = {
	encode(message, writer = new BinaryWriter()) {
		if (message.hashAlgorithm !== "") writer.uint32(18).string(message.hashAlgorithm);
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(26).fork()).join();
		if (message.hashValueHex !== void 0) writer.uint32(34).string(message.hashValueHex);
		if (message.hashValueRaw !== void 0) writer.uint32(42).bytes(message.hashValueRaw);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseHashDataResponse();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 2:
					if (tag !== 18) break;
					message.hashAlgorithm = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.metadata = Metadata.decode(reader, reader.uint32());
					continue;
				case 4:
					if (tag !== 34) break;
					message.hashValueHex = reader.string();
					continue;
				case 5:
					if (tag !== 42) break;
					message.hashValueRaw = reader.bytes();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			hashAlgorithm: isSet$1(object.hashAlgorithm) ? globalThis.String(object.hashAlgorithm) : "",
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0,
			hashValueHex: isSet$1(object.hashValueHex) ? globalThis.String(object.hashValueHex) : void 0,
			hashValueRaw: isSet$1(object.hashValueRaw) ? bytesFromBase64(object.hashValueRaw) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.hashAlgorithm !== "") obj.hashAlgorithm = message.hashAlgorithm;
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		if (message.hashValueHex !== void 0) obj.hashValueHex = message.hashValueHex;
		if (message.hashValueRaw !== void 0) obj.hashValueRaw = base64FromBytes(message.hashValueRaw);
		return obj;
	},
	create(base) {
		return HashDataResponse.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseHashDataResponse();
		message.hashAlgorithm = object.hashAlgorithm ?? "";
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		message.hashValueHex = object.hashValueHex ?? void 0;
		message.hashValueRaw = object.hashValueRaw ?? void 0;
		return message;
	}
};
function createBaseSignCertificateRequest() {
	return {
		profile: "",
		csr: "",
		caPrivateKey: "",
		caCert: "",
		metadata: void 0,
		validNotBefore: void 0,
		validNotAfter: void 0,
		subject: void 0,
		crlDistributionPoints: [],
		outputFormat: 0
	};
}
const SignCertificateRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.profile !== "") writer.uint32(10).string(message.profile);
		if (message.csr !== "") writer.uint32(18).string(message.csr);
		if (message.caPrivateKey !== "") writer.uint32(26).string(message.caPrivateKey);
		if (message.caCert !== "") writer.uint32(34).string(message.caCert);
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(42).fork()).join();
		if (message.validNotBefore !== void 0) {
			if (BigInt.asUintN(64, message.validNotBefore) !== message.validNotBefore) throw new globalThis.Error("value provided for field message.validNotBefore of type uint64 too large");
			writer.uint32(48).uint64(message.validNotBefore);
		}
		if (message.validNotAfter !== void 0) {
			if (BigInt.asUintN(64, message.validNotAfter) !== message.validNotAfter) throw new globalThis.Error("value provided for field message.validNotAfter of type uint64 too large");
			writer.uint32(56).uint64(message.validNotAfter);
		}
		if (message.subject !== void 0) writer.uint32(66).string(message.subject);
		for (const v of message.crlDistributionPoints) writer.uint32(74).string(v);
		if (message.outputFormat !== 0) writer.uint32(80).int32(message.outputFormat);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseSignCertificateRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.profile = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.csr = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.caPrivateKey = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.caCert = reader.string();
					continue;
				case 5:
					if (tag !== 42) break;
					message.metadata = Metadata.decode(reader, reader.uint32());
					continue;
				case 6:
					if (tag !== 48) break;
					message.validNotBefore = reader.uint64();
					continue;
				case 7:
					if (tag !== 56) break;
					message.validNotAfter = reader.uint64();
					continue;
				case 8:
					if (tag !== 66) break;
					message.subject = reader.string();
					continue;
				case 9:
					if (tag !== 74) break;
					message.crlDistributionPoints.push(reader.string());
					continue;
				case 10:
					if (tag !== 80) break;
					message.outputFormat = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			profile: isSet$1(object.profile) ? globalThis.String(object.profile) : "",
			csr: isSet$1(object.csr) ? globalThis.String(object.csr) : "",
			caPrivateKey: isSet$1(object.caPrivateKey) ? globalThis.String(object.caPrivateKey) : "",
			caCert: isSet$1(object.caCert) ? globalThis.String(object.caCert) : "",
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0,
			validNotBefore: isSet$1(object.validNotBefore) ? BigInt(object.validNotBefore) : void 0,
			validNotAfter: isSet$1(object.validNotAfter) ? BigInt(object.validNotAfter) : void 0,
			subject: isSet$1(object.subject) ? globalThis.String(object.subject) : void 0,
			crlDistributionPoints: globalThis.Array.isArray(object?.crlDistributionPoints) ? object.crlDistributionPoints.map((e) => globalThis.String(e)) : [],
			outputFormat: isSet$1(object.outputFormat) ? signOutputFormatFromJSON(object.outputFormat) : 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.profile !== "") obj.profile = message.profile;
		if (message.csr !== "") obj.csr = message.csr;
		if (message.caPrivateKey !== "") obj.caPrivateKey = message.caPrivateKey;
		if (message.caCert !== "") obj.caCert = message.caCert;
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		if (message.validNotBefore !== void 0) obj.validNotBefore = message.validNotBefore.toString();
		if (message.validNotAfter !== void 0) obj.validNotAfter = message.validNotAfter.toString();
		if (message.subject !== void 0) obj.subject = message.subject;
		if (message.crlDistributionPoints?.length) obj.crlDistributionPoints = message.crlDistributionPoints;
		if (message.outputFormat !== 0) obj.outputFormat = signOutputFormatToJSON(message.outputFormat);
		return obj;
	},
	create(base) {
		return SignCertificateRequest.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseSignCertificateRequest();
		message.profile = object.profile ?? "";
		message.csr = object.csr ?? "";
		message.caPrivateKey = object.caPrivateKey ?? "";
		message.caCert = object.caCert ?? "";
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		message.validNotBefore = object.validNotBefore !== void 0 && object.validNotBefore !== null ? BigInt(object.validNotBefore) : void 0;
		message.validNotAfter = object.validNotAfter !== void 0 && object.validNotAfter !== null ? BigInt(object.validNotAfter) : void 0;
		message.subject = object.subject ?? void 0;
		message.crlDistributionPoints = object.crlDistributionPoints?.map((e) => e) || [];
		message.outputFormat = object.outputFormat ?? 0;
		return message;
	}
};
function createBaseSignCertificateResponse() {
	return {
		metadata: void 0,
		pem: void 0,
		der: void 0
	};
}
const SignCertificateResponse = {
	encode(message, writer = new BinaryWriter()) {
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(18).fork()).join();
		if (message.pem !== void 0) writer.uint32(26).string(message.pem);
		if (message.der !== void 0) writer.uint32(34).bytes(message.der);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseSignCertificateResponse();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 2:
					if (tag !== 18) break;
					message.metadata = Metadata.decode(reader, reader.uint32());
					continue;
				case 3:
					if (tag !== 26) break;
					message.pem = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.der = reader.bytes();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0,
			pem: isSet$1(object.pem) ? globalThis.String(object.pem) : void 0,
			der: isSet$1(object.der) ? bytesFromBase64(object.der) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		if (message.pem !== void 0) obj.pem = message.pem;
		if (message.der !== void 0) obj.der = base64FromBytes(message.der);
		return obj;
	},
	create(base) {
		return SignCertificateResponse.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseSignCertificateResponse();
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		message.pem = object.pem ?? void 0;
		message.der = object.der ?? void 0;
		return message;
	}
};
function createBaseEncryptDataRequest() {
	return {
		profile: "",
		keySource: void 0,
		plaintext: /* @__PURE__ */ new Uint8Array(0),
		encryptMetadata: void 0,
		metadata: void 0
	};
}
const EncryptDataRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.profile !== "") writer.uint32(10).string(message.profile);
		if (message.keySource !== void 0) KeySource.encode(message.keySource, writer.uint32(18).fork()).join();
		if (message.plaintext.length !== 0) writer.uint32(26).bytes(message.plaintext);
		if (message.encryptMetadata !== void 0) EncryptMetadata.encode(message.encryptMetadata, writer.uint32(34).fork()).join();
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(42).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseEncryptDataRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.profile = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.keySource = KeySource.decode(reader, reader.uint32());
					continue;
				case 3:
					if (tag !== 26) break;
					message.plaintext = reader.bytes();
					continue;
				case 4:
					if (tag !== 34) break;
					message.encryptMetadata = EncryptMetadata.decode(reader, reader.uint32());
					continue;
				case 5:
					if (tag !== 42) break;
					message.metadata = Metadata.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			profile: isSet$1(object.profile) ? globalThis.String(object.profile) : "",
			keySource: isSet$1(object.keySource) ? KeySource.fromJSON(object.keySource) : void 0,
			plaintext: isSet$1(object.plaintext) ? bytesFromBase64(object.plaintext) : /* @__PURE__ */ new Uint8Array(0),
			encryptMetadata: isSet$1(object.encryptMetadata) ? EncryptMetadata.fromJSON(object.encryptMetadata) : void 0,
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.profile !== "") obj.profile = message.profile;
		if (message.keySource !== void 0) obj.keySource = KeySource.toJSON(message.keySource);
		if (message.plaintext.length !== 0) obj.plaintext = base64FromBytes(message.plaintext);
		if (message.encryptMetadata !== void 0) obj.encryptMetadata = EncryptMetadata.toJSON(message.encryptMetadata);
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		return obj;
	},
	create(base) {
		return EncryptDataRequest.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseEncryptDataRequest();
		message.profile = object.profile ?? "";
		message.keySource = object.keySource !== void 0 && object.keySource !== null ? KeySource.fromPartial(object.keySource) : void 0;
		message.plaintext = object.plaintext ?? /* @__PURE__ */ new Uint8Array(0);
		message.encryptMetadata = object.encryptMetadata !== void 0 && object.encryptMetadata !== null ? EncryptMetadata.fromPartial(object.encryptMetadata) : void 0;
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		return message;
	}
};
function createBaseEncryptDataResponse() {
	return {
		ciphertext: /* @__PURE__ */ new Uint8Array(0),
		cipherMetadata: void 0,
		metadata: void 0
	};
}
const EncryptDataResponse = {
	encode(message, writer = new BinaryWriter()) {
		if (message.ciphertext.length !== 0) writer.uint32(10).bytes(message.ciphertext);
		if (message.cipherMetadata !== void 0) CipherMetadata.encode(message.cipherMetadata, writer.uint32(18).fork()).join();
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(26).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseEncryptDataResponse();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.ciphertext = reader.bytes();
					continue;
				case 2:
					if (tag !== 18) break;
					message.cipherMetadata = CipherMetadata.decode(reader, reader.uint32());
					continue;
				case 3:
					if (tag !== 26) break;
					message.metadata = Metadata.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			ciphertext: isSet$1(object.ciphertext) ? bytesFromBase64(object.ciphertext) : /* @__PURE__ */ new Uint8Array(0),
			cipherMetadata: isSet$1(object.cipherMetadata) ? CipherMetadata.fromJSON(object.cipherMetadata) : void 0,
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.ciphertext.length !== 0) obj.ciphertext = base64FromBytes(message.ciphertext);
		if (message.cipherMetadata !== void 0) obj.cipherMetadata = CipherMetadata.toJSON(message.cipherMetadata);
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		return obj;
	},
	create(base) {
		return EncryptDataResponse.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseEncryptDataResponse();
		message.ciphertext = object.ciphertext ?? /* @__PURE__ */ new Uint8Array(0);
		message.cipherMetadata = object.cipherMetadata !== void 0 && object.cipherMetadata !== null ? CipherMetadata.fromPartial(object.cipherMetadata) : void 0;
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		return message;
	}
};
function createBaseDecryptDataRequest() {
	return {
		profile: "",
		keySource: void 0,
		ciphertext: /* @__PURE__ */ new Uint8Array(0),
		decryptMetadata: void 0,
		metadata: void 0
	};
}
const DecryptDataRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.profile !== "") writer.uint32(10).string(message.profile);
		if (message.keySource !== void 0) KeySource.encode(message.keySource, writer.uint32(18).fork()).join();
		if (message.ciphertext.length !== 0) writer.uint32(26).bytes(message.ciphertext);
		if (message.decryptMetadata !== void 0) DecryptMetadata.encode(message.decryptMetadata, writer.uint32(34).fork()).join();
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(42).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseDecryptDataRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.profile = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.keySource = KeySource.decode(reader, reader.uint32());
					continue;
				case 3:
					if (tag !== 26) break;
					message.ciphertext = reader.bytes();
					continue;
				case 4:
					if (tag !== 34) break;
					message.decryptMetadata = DecryptMetadata.decode(reader, reader.uint32());
					continue;
				case 5:
					if (tag !== 42) break;
					message.metadata = Metadata.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			profile: isSet$1(object.profile) ? globalThis.String(object.profile) : "",
			keySource: isSet$1(object.keySource) ? KeySource.fromJSON(object.keySource) : void 0,
			ciphertext: isSet$1(object.ciphertext) ? bytesFromBase64(object.ciphertext) : /* @__PURE__ */ new Uint8Array(0),
			decryptMetadata: isSet$1(object.decryptMetadata) ? DecryptMetadata.fromJSON(object.decryptMetadata) : void 0,
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.profile !== "") obj.profile = message.profile;
		if (message.keySource !== void 0) obj.keySource = KeySource.toJSON(message.keySource);
		if (message.ciphertext.length !== 0) obj.ciphertext = base64FromBytes(message.ciphertext);
		if (message.decryptMetadata !== void 0) obj.decryptMetadata = DecryptMetadata.toJSON(message.decryptMetadata);
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		return obj;
	},
	create(base) {
		return DecryptDataRequest.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseDecryptDataRequest();
		message.profile = object.profile ?? "";
		message.keySource = object.keySource !== void 0 && object.keySource !== null ? KeySource.fromPartial(object.keySource) : void 0;
		message.ciphertext = object.ciphertext ?? /* @__PURE__ */ new Uint8Array(0);
		message.decryptMetadata = object.decryptMetadata !== void 0 && object.decryptMetadata !== null ? DecryptMetadata.fromPartial(object.decryptMetadata) : void 0;
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		return message;
	}
};
function createBaseDecryptDataResponse() {
	return {
		plaintext: /* @__PURE__ */ new Uint8Array(0),
		metadata: void 0
	};
}
const DecryptDataResponse = {
	encode(message, writer = new BinaryWriter()) {
		if (message.plaintext.length !== 0) writer.uint32(10).bytes(message.plaintext);
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(18).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseDecryptDataResponse();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.plaintext = reader.bytes();
					continue;
				case 2:
					if (tag !== 18) break;
					message.metadata = Metadata.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			plaintext: isSet$1(object.plaintext) ? bytesFromBase64(object.plaintext) : /* @__PURE__ */ new Uint8Array(0),
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.plaintext.length !== 0) obj.plaintext = base64FromBytes(message.plaintext);
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		return obj;
	},
	create(base) {
		return DecryptDataResponse.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseDecryptDataResponse();
		message.plaintext = object.plaintext ?? /* @__PURE__ */ new Uint8Array(0);
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		return message;
	}
};
function createBaseBenchmarkRequest() {
	return { metadata: void 0 };
}
const BenchmarkRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(10).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseBenchmarkRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.metadata = Metadata.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return { metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0 };
	},
	toJSON(message) {
		const obj = {};
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		return obj;
	},
	create(base) {
		return BenchmarkRequest.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseBenchmarkRequest();
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		return message;
	}
};
function createBaseBenchmarkResponse() {
	return {
		benchmarkResults: "",
		metadata: void 0
	};
}
const BenchmarkResponse = {
	encode(message, writer = new BinaryWriter()) {
		if (message.benchmarkResults !== "") writer.uint32(10).string(message.benchmarkResults);
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(18).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseBenchmarkResponse();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.benchmarkResults = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.metadata = Metadata.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			benchmarkResults: isSet$1(object.benchmarkResults) ? globalThis.String(object.benchmarkResults) : "",
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.benchmarkResults !== "") obj.benchmarkResults = message.benchmarkResults;
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		return obj;
	},
	create(base) {
		return BenchmarkResponse.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseBenchmarkResponse();
		message.benchmarkResults = object.benchmarkResults ?? "";
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		return message;
	}
};
function createBaseFakeEndpointRequest() {
	return { metadata: void 0 };
}
const FakeEndpointRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(10).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseFakeEndpointRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.metadata = Metadata.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return { metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0 };
	},
	toJSON(message) {
		const obj = {};
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		return obj;
	},
	create(base) {
		return FakeEndpointRequest.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseFakeEndpointRequest();
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		return message;
	}
};
function createBaseFakeEndpointResponse() {
	return {
		message: "",
		metadata: void 0
	};
}
const FakeEndpointResponse = {
	encode(message, writer = new BinaryWriter()) {
		if (message.message !== "") writer.uint32(10).string(message.message);
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(18).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseFakeEndpointResponse();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.message = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.metadata = Metadata.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			message: isSet$1(object.message) ? globalThis.String(object.message) : "",
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.message !== "") obj.message = message.message;
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		return obj;
	},
	create(base) {
		return FakeEndpointResponse.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseFakeEndpointResponse();
		message.message = object.message ?? "";
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		return message;
	}
};
var CryptoGrpcClientImpl = class {
	rpc;
	service;
	constructor(rpc, opts) {
		this.service = opts?.service || "CryptoBroker.CryptoGrpc";
		this.rpc = rpc;
		this.HashData = this.HashData.bind(this);
		this.SignCertificate = this.SignCertificate.bind(this);
		this.EncryptData = this.EncryptData.bind(this);
		this.DecryptData = this.DecryptData.bind(this);
	}
	HashData(request) {
		const data = HashDataRequest.encode(request).finish();
		return this.rpc.request(this.service, "HashData", data).then((data) => HashDataResponse.decode(new BinaryReader(data)));
	}
	SignCertificate(request) {
		const data = SignCertificateRequest.encode(request).finish();
		return this.rpc.request(this.service, "SignCertificate", data).then((data) => SignCertificateResponse.decode(new BinaryReader(data)));
	}
	EncryptData(request) {
		const data = EncryptDataRequest.encode(request).finish();
		return this.rpc.request(this.service, "EncryptData", data).then((data) => EncryptDataResponse.decode(new BinaryReader(data)));
	}
	DecryptData(request) {
		const data = DecryptDataRequest.encode(request).finish();
		return this.rpc.request(this.service, "DecryptData", data).then((data) => DecryptDataResponse.decode(new BinaryReader(data)));
	}
};
var CryptoGrpcDevClientImpl = class {
	rpc;
	service;
	constructor(rpc, opts) {
		this.service = opts?.service || "CryptoBroker.CryptoGrpcDev";
		this.rpc = rpc;
		this.Benchmark = this.Benchmark.bind(this);
		this.FakeEndpoint = this.FakeEndpoint.bind(this);
	}
	Benchmark(request) {
		const data = BenchmarkRequest.encode(request).finish();
		return this.rpc.request(this.service, "Benchmark", data).then((data) => BenchmarkResponse.decode(new BinaryReader(data)));
	}
	FakeEndpoint(request) {
		const data = FakeEndpointRequest.encode(request).finish();
		return this.rpc.request(this.service, "FakeEndpoint", data).then((data) => FakeEndpointResponse.decode(new BinaryReader(data)));
	}
};
function bytesFromBase64(b64) {
	if (globalThis.Buffer) return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
	else {
		const bin = globalThis.atob(b64);
		const arr = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; ++i) arr[i] = bin.charCodeAt(i);
		return arr;
	}
}
function base64FromBytes(arr) {
	if (globalThis.Buffer) return globalThis.Buffer.from(arr).toString("base64");
	else {
		const bin = [];
		arr.forEach((byte) => {
			bin.push(globalThis.String.fromCharCode(byte));
		});
		return globalThis.btoa(bin.join(""));
	}
}
function isSet$1(value) {
	return value !== null && value !== void 0;
}
//#endregion
//#region src/lib/proto/third_party/grpc/health/v1/health.ts
function healthCheckResponse_ServingStatusFromJSON(object) {
	switch (object) {
		case 0:
		case "UNKNOWN": return 0;
		case 1:
		case "SERVING": return 1;
		case 2:
		case "NOT_SERVING": return 2;
		case 3:
		case "SERVICE_UNKNOWN": return 3;
		default: return -1;
	}
}
function healthCheckResponse_ServingStatusToJSON(object) {
	switch (object) {
		case 0: return "UNKNOWN";
		case 1: return "SERVING";
		case 2: return "NOT_SERVING";
		case 3: return "SERVICE_UNKNOWN";
		default: return "UNRECOGNIZED";
	}
}
function createBaseHealthCheckRequest() {
	return { service: "" };
}
const HealthCheckRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.service !== "") writer.uint32(10).string(message.service);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseHealthCheckRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.service = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return { service: isSet(object.service) ? globalThis.String(object.service) : "" };
	},
	toJSON(message) {
		const obj = {};
		if (message.service !== "") obj.service = message.service;
		return obj;
	},
	create(base) {
		return HealthCheckRequest.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseHealthCheckRequest();
		message.service = object.service ?? "";
		return message;
	}
};
function createBaseHealthCheckResponse() {
	return { status: 0 };
}
const HealthCheckResponse = {
	encode(message, writer = new BinaryWriter()) {
		if (message.status !== 0) writer.uint32(8).int32(message.status);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseHealthCheckResponse();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.status = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return { status: isSet(object.status) ? healthCheckResponse_ServingStatusFromJSON(object.status) : 0 };
	},
	toJSON(message) {
		const obj = {};
		if (message.status !== 0) obj.status = healthCheckResponse_ServingStatusToJSON(message.status);
		return obj;
	},
	create(base) {
		return HealthCheckResponse.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseHealthCheckResponse();
		message.status = object.status ?? 0;
		return message;
	}
};
function createBaseHealthListRequest() {
	return {};
}
const HealthListRequest = {
	encode(_, writer = new BinaryWriter()) {
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseHealthListRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			tag >>> 3;
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(_) {
		return {};
	},
	toJSON(_) {
		return {};
	},
	create(base) {
		return HealthListRequest.fromPartial(base ?? {});
	},
	fromPartial(_) {
		return createBaseHealthListRequest();
	}
};
function createBaseHealthListResponse() {
	return { statuses: {} };
}
const HealthListResponse = {
	encode(message, writer = new BinaryWriter()) {
		globalThis.Object.entries(message.statuses).forEach(([key, value]) => {
			HealthListResponse_StatusesEntry.encode({
				key,
				value
			}, writer.uint32(10).fork()).join();
		});
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseHealthListResponse();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1: {
					if (tag !== 10) break;
					const entry1 = HealthListResponse_StatusesEntry.decode(reader, reader.uint32());
					if (entry1.value !== void 0) message.statuses[entry1.key] = entry1.value;
					continue;
				}
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return { statuses: isObject(object.statuses) ? globalThis.Object.entries(object.statuses).reduce((acc, [key, value]) => {
			acc[key] = HealthCheckResponse.fromJSON(value);
			return acc;
		}, {}) : {} };
	},
	toJSON(message) {
		const obj = {};
		if (message.statuses) {
			const entries = globalThis.Object.entries(message.statuses);
			if (entries.length > 0) {
				obj.statuses = {};
				entries.forEach(([k, v]) => {
					obj.statuses[k] = HealthCheckResponse.toJSON(v);
				});
			}
		}
		return obj;
	},
	create(base) {
		return HealthListResponse.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseHealthListResponse();
		message.statuses = globalThis.Object.entries(object.statuses ?? {}).reduce((acc, [key, value]) => {
			if (value !== void 0) acc[key] = HealthCheckResponse.fromPartial(value);
			return acc;
		}, {});
		return message;
	}
};
function createBaseHealthListResponse_StatusesEntry() {
	return {
		key: "",
		value: void 0
	};
}
const HealthListResponse_StatusesEntry = {
	encode(message, writer = new BinaryWriter()) {
		if (message.key !== "") writer.uint32(10).string(message.key);
		if (message.value !== void 0) HealthCheckResponse.encode(message.value, writer.uint32(18).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseHealthListResponse_StatusesEntry();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.key = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.value = HealthCheckResponse.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			key: isSet(object.key) ? globalThis.String(object.key) : "",
			value: isSet(object.value) ? HealthCheckResponse.fromJSON(object.value) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.key !== "") obj.key = message.key;
		if (message.value !== void 0) obj.value = HealthCheckResponse.toJSON(message.value);
		return obj;
	},
	create(base) {
		return HealthListResponse_StatusesEntry.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseHealthListResponse_StatusesEntry();
		message.key = object.key ?? "";
		message.value = object.value !== void 0 && object.value !== null ? HealthCheckResponse.fromPartial(object.value) : void 0;
		return message;
	}
};
var HealthClientImpl = class {
	rpc;
	service;
	constructor(rpc, opts) {
		this.service = opts?.service || "grpc.health.v1.Health";
		this.rpc = rpc;
		this.Check = this.Check.bind(this);
		this.List = this.List.bind(this);
	}
	Check(request) {
		const data = HealthCheckRequest.encode(request).finish();
		return this.rpc.request(this.service, "Check", data).then((data) => HealthCheckResponse.decode(new BinaryReader(data)));
	}
	List(request) {
		const data = HealthListRequest.encode(request).finish();
		return this.rpc.request(this.service, "List", data).then((data) => HealthListResponse.decode(new BinaryReader(data)));
	}
};
function isObject(value) {
	return typeof value === "object" && value !== null;
}
function isSet(value) {
	return value !== null && value !== void 0;
}
//#endregion
//#region src/lib/request_validation.ts
const maxProfileNameLen = 64;
const maxHashDataInputBytes = 1 << 20;
const maxCSRBytes = 65536;
const maxCAPrivateKeyBytes = 65536;
const maxCACertBytes = 65536;
const maxSubjectLen = 1024;
const maxCRLDistributionPoints = 16;
const maxCRLDistributionPointLen = 2048;
const maxKeyIdLen = 1024;
const maxMetadataIdLen = 128;
const maxTraceIdLen = 32;
const maxSpanIdLen = 16;
const maxTraceFlagsLen = 2;
const maxTraceStateLen = 512;
const maxCorrelationIdLen = 128;
const maxUint64 = BigInt("18446744073709551615");
function typeError(field, msg) {
	return /* @__PURE__ */ new TypeError(`${field}: ${msg}`);
}
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function assertObject(value, field) {
	if (!isRecord(value)) throw typeError(field, "must be an object");
}
function assertString(value, field, max, required = false) {
	if (typeof value !== "string") throw typeError(field, "must be a string");
	if (required && value === "") throw typeError(field, "required");
	if (value.length > max) throw typeError(field, `too large (max ${max})`);
}
function assertOptionalString(value, field, max) {
	if (value === void 0) return;
	assertString(value, field, max);
}
function enumKeysToStringArray(enumType) {
	return Object.keys(enumType).filter((key) => isNaN(Number(key))).filter((key) => key !== "UNRECOGNIZED");
}
function assertEnumValue(value, enumType, field) {
	const values = Object.values(enumType).filter((v) => typeof v === "number").filter((v) => v != -1);
	const stringValues = enumKeysToStringArray(enumType);
	if (!values.includes(value)) throw typeError(field, `must be one of: ${stringValues.join(", ")}`);
}
function assertOptionalUint64(value, field) {
	if (value === void 0) return;
	if (typeof value === "bigint") {
		if (value < 0n || value > maxUint64) throw typeError(field, "must be a uint64-compatible value");
		return;
	}
	if (typeof value === "number") {
		if (!Number.isSafeInteger(value) || value < 0 || value > Number.MAX_SAFE_INTEGER) throw typeError(field, "must be a uint64-compatible value");
		return;
	}
	throw typeError(field, "must be a uint64-compatible value");
}
function assertUint8Array(value, field) {
	if (!(value instanceof Uint8Array)) throw typeError(field, "must be Uint8Array");
}
function assertOptionalUint8Array(value, field) {
	if (value === void 0) return;
	assertUint8Array(value, field);
}
function validateMetadata(metadata) {
	if (metadata === void 0) return;
	assertObject(metadata, "metadata");
	assertOptionalString(metadata.id, "metadata.id", maxMetadataIdLen);
	if (metadata.traceContext === void 0) return;
	assertObject(metadata.traceContext, "metadata.traceContext");
	assertString(metadata.traceContext.traceId, "metadata.traceContext.traceId", maxTraceIdLen);
	assertString(metadata.traceContext.spanId, "metadata.traceContext.spanId", maxSpanIdLen);
	assertString(metadata.traceContext.traceFlags, "metadata.traceContext.traceFlags", maxTraceFlagsLen);
	assertString(metadata.traceContext.traceState, "metadata.traceContext.traceState", maxTraceStateLen);
	assertString(metadata.traceContext.correlationId, "metadata.traceContext.correlationId", maxCorrelationIdLen);
}
function validateBenchmarkPayload(payload) {
	assertObject(payload, "payload");
	validateMetadata(payload.metadata);
}
function validateHashDataPayload(payload) {
	assertObject(payload, "payload");
	assertString(payload.profile, "profile", maxProfileNameLen, true);
	assertEnumValue(payload.outputFormat, HashOutputFormat, "outputFormat");
	assertUint8Array(payload.input, "input");
	if (payload.input.length > maxHashDataInputBytes) throw typeError("input", `too large (max ${maxHashDataInputBytes})`);
	validateMetadata(payload.metadata);
}
function validateSignCertificatePayload(payload) {
	assertObject(payload, "payload");
	assertString(payload.profile, "profile", maxProfileNameLen, true);
	assertString(payload.csr, "csr", maxCSRBytes, true);
	assertString(payload.caPrivateKey, "caPrivateKey", maxCAPrivateKeyBytes, true);
	assertString(payload.caCert, "caCert", maxCACertBytes, true);
	assertOptionalUint64(payload.validNotBefore, "validNotBefore");
	assertOptionalUint64(payload.validNotAfter, "validNotAfter");
	assertOptionalString(payload.subject, "subject", maxSubjectLen);
	assertEnumValue(payload.outputFormat, SignOutputFormat, "outputFormat");
	if (payload.crlDistributionPoints !== void 0) {
		if (!Array.isArray(payload.crlDistributionPoints)) throw typeError("crlDistributionPoints", "must be an array");
		if (payload.crlDistributionPoints.length > maxCRLDistributionPoints) throw typeError("crlDistributionPoints", `too many entries (max ${maxCRLDistributionPoints})`);
		payload.crlDistributionPoints.forEach((value, index) => {
			assertString(value, `crlDistributionPoints[${index}]`, maxCRLDistributionPointLen);
		});
	}
	validateMetadata(payload.metadata);
}
function validateEncryptDataPayload(payload) {
	assertObject(payload, "payload");
	assertString(payload.profile, "profile", maxProfileNameLen, true);
	assertObject(payload.keySource, "keySource");
	assertOptionalString(payload.keySource.keyId, "keySource.keyId", maxKeyIdLen);
	assertOptionalUint8Array(payload.keySource.rawKey, "keySource.rawKey");
	assertUint8Array(payload.plaintext, "plaintext");
	assertObject(payload.encryptMetadata, "encryptMetadata");
	assertOptionalUint8Array(payload.encryptMetadata.nonce, "encryptMetadata.nonce");
	assertOptionalUint8Array(payload.encryptMetadata.aad, "encryptMetadata.aad");
	if (payload.keySource.keyId === void 0 && payload.keySource.rawKey === void 0) throw typeError("keySource", "missing key source - either keyId or rawKey must be provided");
	validateMetadata(payload.metadata);
}
function validateDecryptDataPayload(payload) {
	assertObject(payload, "payload");
	assertString(payload.profile, "profile", maxProfileNameLen, true);
	assertObject(payload.keySource, "keySource");
	assertOptionalString(payload.keySource.keyId, "keySource.keyId", maxKeyIdLen);
	assertOptionalUint8Array(payload.keySource.rawKey, "keySource.rawKey");
	assertUint8Array(payload.ciphertext, "ciphertext");
	assertObject(payload.decryptMetadata, "decryptMetadata");
	assertOptionalUint8Array(payload.decryptMetadata.nonce, "decryptMetadata.nonce");
	assertOptionalUint8Array(payload.decryptMetadata.aad, "decryptMetadata.aad");
	assertOptionalUint8Array(payload.decryptMetadata.tag, "decryptMetadata.tag");
	if (payload.keySource.keyId === void 0 && payload.keySource.rawKey === void 0) throw typeError("keySource", "missing key source - either keyId or rawKey must be provided");
	validateMetadata(payload.metadata);
}
//#endregion
//#region \0@oxc-project+runtime@0.144.0/helpers/esm/decorate.js
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
//#endregion
//#region src/lib/client.ts
const breakers = /* @__PURE__ */ new WeakMap();
function WithCircuitBreaker(_prototype, name, descriptor) {
	const original = descriptor.value;
	descriptor.value = function(...args) {
		const self = this;
		let byMethod = breakers.get(self);
		if (!byMethod) {
			byMethod = /* @__PURE__ */ new Map();
			breakers.set(self, byMethod);
		}
		let breaker = byMethod.get(name);
		if (!breaker) {
			breaker = new opossum.default((...args) => original.apply(this, args), self.breakerConfig);
			byMethod.set(name, breaker);
		}
		return breaker.fire(...args);
	};
	return descriptor;
}
var CryptoBrokerClient = class CryptoBrokerClient {
	client;
	healthClient;
	devClient;
	address;
	conn;
	breakerConfig;
	constructor(opts = {}) {
		this.address = "unix:/tmp/open-crypto-broker/crypto-broker-server.sock";
		const grpcOptions = {
			["grpc.service_config"]: JSON.stringify(defaultServiceConfig),
			...opts.grpcOptions
		};
		this.breakerConfig = circuitBreakerConfigFactory(opts.circuitBreakerOptions);
		this.conn = new _grpc_grpc_js.Client(this.address, _grpc_grpc_js.credentials.createInsecure(), grpcOptions);
		const sendRequest = (service, method, data) => {
			const path = `/${service}/${method}`;
			return new Promise((resolve, reject) => {
				const resultCallback = (err, res) => {
					if (err) return reject(err);
					resolve(res);
				};
				function passThrough(argument) {
					return argument;
				}
				this.conn.makeUnaryRequest(path, (d) => Buffer.from(d), passThrough, data, resultCallback);
			});
		};
		const rpc = { request: sendRequest };
		const hcRpc = { request: sendRequest };
		this.client = new CryptoGrpcClientImpl(rpc);
		this.healthClient = new HealthClientImpl(hcRpc);
		this.devClient = new CryptoGrpcDevClientImpl(rpc);
	}
	static async NewLibrary(opts) {
		const instance = new CryptoBrokerClient(opts);
		const conn_max_retries = opts?.connectOptions?.retryAmount ?? 60;
		const conn_retry_delay_ms = 1e3;
		for (let attempt = 1; attempt <= conn_max_retries; attempt++) {
			const deadline = Date.now() + conn_retry_delay_ms;
			try {
				await new Promise((resolve, reject) => {
					instance.conn.waitForReady(deadline, (err) => err ? reject(err) : resolve());
				});
				return instance;
			} catch {
				console.error(`Could not establish connection. Retrying... (${attempt}/${conn_max_retries})`);
			}
		}
		throw new Error("retry limit reached");
	}
	async benchmarkData(payload) {
		validateBenchmarkPayload(payload);
		const req = { metadata: {
			id: payload.metadata?.id || (0, crypto.randomUUID)(),
			...payload.metadata?.traceContext !== void 0 && { traceContext: payload.metadata?.traceContext }
		} };
		return this.devClient.Benchmark(req).then((res) => res);
	}
	async hashData(payload) {
		validateHashDataPayload(payload);
		const req = {
			profile: payload.profile,
			input: payload.input,
			outputFormat: payload.outputFormat,
			metadata: {
				id: payload.metadata?.id || (0, crypto.randomUUID)(),
				...payload.metadata?.traceContext !== void 0 && { traceContext: payload.metadata?.traceContext }
			}
		};
		return this.client.HashData(req).then((res) => res);
	}
	async signCertificate(payload) {
		validateSignCertificatePayload(payload);
		const req = {
			profile: payload.profile,
			csr: payload.csr,
			caPrivateKey: payload.caPrivateKey,
			caCert: payload.caCert,
			outputFormat: payload.outputFormat,
			metadata: {
				id: payload.metadata?.id || (0, crypto.randomUUID)(),
				...payload.metadata?.traceContext !== void 0 && { traceContext: payload.metadata?.traceContext }
			},
			validNotBefore: payload.validNotBefore,
			validNotAfter: payload.validNotAfter,
			subject: payload.subject,
			crlDistributionPoints: payload.crlDistributionPoints || []
		};
		return this.client.SignCertificate(req).then((res) => res);
	}
	async encryptData(payload) {
		validateEncryptDataPayload(payload);
		const req = {
			profile: payload.profile,
			keySource: payload.keySource,
			plaintext: payload.plaintext,
			encryptMetadata: payload.encryptMetadata,
			metadata: {
				id: payload.metadata?.id || (0, crypto.randomUUID)(),
				...payload.metadata?.traceContext !== void 0 && { traceContext: payload.metadata?.traceContext }
			}
		};
		return this.client.EncryptData(req).then((res) => res);
	}
	async decryptData(payload) {
		validateDecryptDataPayload(payload);
		const req = {
			profile: payload.profile,
			keySource: payload.keySource,
			ciphertext: payload.ciphertext,
			decryptMetadata: payload.decryptMetadata,
			metadata: {
				id: payload.metadata?.id || (0, crypto.randomUUID)(),
				...payload.metadata?.traceContext !== void 0 && { traceContext: payload.metadata?.traceContext }
			}
		};
		return this.client.DecryptData(req).then((res) => res);
	}
	async healthData() {
		const req = { service: "" };
		const status_unknown = { status: 0 };
		return this.healthClient.Check(req).then((res) => res).catch(() => status_unknown);
	}
};
__decorate([WithCircuitBreaker], CryptoBrokerClient.prototype, "hashData", null);
__decorate([WithCircuitBreaker], CryptoBrokerClient.prototype, "signCertificate", null);
__decorate([WithCircuitBreaker], CryptoBrokerClient.prototype, "encryptData", null);
__decorate([WithCircuitBreaker], CryptoBrokerClient.prototype, "decryptData", null);
__decorate([WithCircuitBreaker], CryptoBrokerClient.prototype, "healthData", null);
const VERSION = "0.4.2";
const GIT_HASH = "4b7159e5190e834dd3b89dfbd69c4420dda558b4";
//#endregion
exports.CryptoBrokerClient = CryptoBrokerClient;
exports.GIT_HASH = GIT_HASH;
exports.HashDataOutputFormat = HashOutputFormat;
exports.SignCertificateOutputFormat = SignOutputFormat;
exports.VERSION = VERSION;

//# sourceMappingURL=client.cjs.map