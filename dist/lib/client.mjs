import * as grpc from "@grpc/grpc-js";
import { v4 } from "uuid";
import x509 from "@peculiar/x509";
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
//#region \0rolldown/runtime.js
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
//#endregion
//#region src/lib/conf/service_config.ts
const serviceConfig = { methodConfig: [{
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
//#region src/lib/proto/messages.ts
const Long = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(global, factory) {
		function preferDefault(exports$1) {
			return exports$1.default || exports$1;
		}
		if (typeof define === "function" && define.amd) define([], function() {
			var exports$2 = {};
			factory(exports$2);
			return preferDefault(exports$2);
		});
		else if (typeof exports === "object") {
			factory(exports);
			if (typeof module === "object") module.exports = preferDefault(exports);
		} else (function() {
			var exports$3 = {};
			factory(exports$3);
			global.Long = preferDefault(exports$3);
		})();
	})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports, function(_exports) {
		"use strict";
		Object.defineProperty(_exports, "__esModule", { value: true });
		_exports.default = void 0;
		/**
		* @license
		* Copyright 2009 The Closure Library Authors
		* Copyright 2020 Daniel Wirtz / The long.js Authors.
		*
		* Licensed under the Apache License, Version 2.0 (the "License");
		* you may not use this file except in compliance with the License.
		* You may obtain a copy of the License at
		*
		*     http://www.apache.org/licenses/LICENSE-2.0
		*
		* Unless required by applicable law or agreed to in writing, software
		* distributed under the License is distributed on an "AS IS" BASIS,
		* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		* See the License for the specific language governing permissions and
		* limitations under the License.
		*
		* SPDX-License-Identifier: Apache-2.0
		*/
		var wasm = null;
		try {
			wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
				0,
				97,
				115,
				109,
				1,
				0,
				0,
				0,
				1,
				13,
				2,
				96,
				0,
				1,
				127,
				96,
				4,
				127,
				127,
				127,
				127,
				1,
				127,
				3,
				7,
				6,
				0,
				1,
				1,
				1,
				1,
				1,
				6,
				6,
				1,
				127,
				1,
				65,
				0,
				11,
				7,
				50,
				6,
				3,
				109,
				117,
				108,
				0,
				1,
				5,
				100,
				105,
				118,
				95,
				115,
				0,
				2,
				5,
				100,
				105,
				118,
				95,
				117,
				0,
				3,
				5,
				114,
				101,
				109,
				95,
				115,
				0,
				4,
				5,
				114,
				101,
				109,
				95,
				117,
				0,
				5,
				8,
				103,
				101,
				116,
				95,
				104,
				105,
				103,
				104,
				0,
				0,
				10,
				191,
				1,
				6,
				4,
				0,
				35,
				0,
				11,
				36,
				1,
				1,
				126,
				32,
				0,
				173,
				32,
				1,
				173,
				66,
				32,
				134,
				132,
				32,
				2,
				173,
				32,
				3,
				173,
				66,
				32,
				134,
				132,
				126,
				34,
				4,
				66,
				32,
				135,
				167,
				36,
				0,
				32,
				4,
				167,
				11,
				36,
				1,
				1,
				126,
				32,
				0,
				173,
				32,
				1,
				173,
				66,
				32,
				134,
				132,
				32,
				2,
				173,
				32,
				3,
				173,
				66,
				32,
				134,
				132,
				127,
				34,
				4,
				66,
				32,
				135,
				167,
				36,
				0,
				32,
				4,
				167,
				11,
				36,
				1,
				1,
				126,
				32,
				0,
				173,
				32,
				1,
				173,
				66,
				32,
				134,
				132,
				32,
				2,
				173,
				32,
				3,
				173,
				66,
				32,
				134,
				132,
				128,
				34,
				4,
				66,
				32,
				135,
				167,
				36,
				0,
				32,
				4,
				167,
				11,
				36,
				1,
				1,
				126,
				32,
				0,
				173,
				32,
				1,
				173,
				66,
				32,
				134,
				132,
				32,
				2,
				173,
				32,
				3,
				173,
				66,
				32,
				134,
				132,
				129,
				34,
				4,
				66,
				32,
				135,
				167,
				36,
				0,
				32,
				4,
				167,
				11,
				36,
				1,
				1,
				126,
				32,
				0,
				173,
				32,
				1,
				173,
				66,
				32,
				134,
				132,
				32,
				2,
				173,
				32,
				3,
				173,
				66,
				32,
				134,
				132,
				130,
				34,
				4,
				66,
				32,
				135,
				167,
				36,
				0,
				32,
				4,
				167,
				11
			])), {}).exports;
		} catch {}
		/**
		* Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
		*  See the from* functions below for more convenient ways of constructing Longs.
		* @exports Long
		* @class A Long class for representing a 64 bit two's-complement integer value.
		* @param {number} low The low (signed) 32 bits of the long
		* @param {number} high The high (signed) 32 bits of the long
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @constructor
		*/
		function Long(low, high, unsigned) {
			/**
			* The low 32 bits as a signed value.
			* @type {number}
			*/
			this.low = low | 0;
			/**
			* The high 32 bits as a signed value.
			* @type {number}
			*/
			this.high = high | 0;
			/**
			* Whether unsigned or not.
			* @type {boolean}
			*/
			this.unsigned = !!unsigned;
		}
		/**
		* An indicator used to reliably determine if an object is a Long or not.
		* @type {boolean}
		* @const
		* @private
		*/
		Long.prototype.__isLong__;
		Object.defineProperty(Long.prototype, "__isLong__", { value: true });
		/**
		* @function
		* @param {*} obj Object
		* @returns {boolean}
		* @inner
		*/
		function isLong(obj) {
			return (obj && obj["__isLong__"]) === true;
		}
		/**
		* @function
		* @param {*} value number
		* @returns {number}
		* @inner
		*/
		function ctz32(value) {
			var c = Math.clz32(value & -value);
			return value ? 31 - c : c;
		}
		/**
		* Tests if the specified object is a Long.
		* @function
		* @param {*} obj Object
		* @returns {boolean}
		*/
		Long.isLong = isLong;
		/**
		* A cache of the Long representations of small integer values.
		* @type {!Object}
		* @inner
		*/
		var INT_CACHE = {};
		/**
		* A cache of the Long representations of small unsigned integer values.
		* @type {!Object}
		* @inner
		*/
		var UINT_CACHE = {};
		/**
		* @param {number} value
		* @param {boolean=} unsigned
		* @returns {!Long}
		* @inner
		*/
		function fromInt(value, unsigned) {
			var obj, cachedObj, cache;
			if (unsigned) {
				value >>>= 0;
				if (cache = 0 <= value && value < 256) {
					cachedObj = UINT_CACHE[value];
					if (cachedObj) return cachedObj;
				}
				obj = fromBits(value, 0, true);
				if (cache) UINT_CACHE[value] = obj;
				return obj;
			} else {
				value |= 0;
				if (cache = -128 <= value && value < 128) {
					cachedObj = INT_CACHE[value];
					if (cachedObj) return cachedObj;
				}
				obj = fromBits(value, value < 0 ? -1 : 0, false);
				if (cache) INT_CACHE[value] = obj;
				return obj;
			}
		}
		/**
		* Returns a Long representing the given 32 bit integer value.
		* @function
		* @param {number} value The 32 bit integer in question
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @returns {!Long} The corresponding Long value
		*/
		Long.fromInt = fromInt;
		/**
		* @param {number} value
		* @param {boolean=} unsigned
		* @returns {!Long}
		* @inner
		*/
		function fromNumber(value, unsigned) {
			if (isNaN(value)) return unsigned ? UZERO : ZERO;
			if (unsigned) {
				if (value < 0) return UZERO;
				if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
			} else {
				if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
				if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
			}
			if (value < 0) return fromNumber(-value, unsigned).neg();
			return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
		}
		/**
		* Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
		* @function
		* @param {number} value The number in question
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @returns {!Long} The corresponding Long value
		*/
		Long.fromNumber = fromNumber;
		/**
		* @param {number} lowBits
		* @param {number} highBits
		* @param {boolean=} unsigned
		* @returns {!Long}
		* @inner
		*/
		function fromBits(lowBits, highBits, unsigned) {
			return new Long(lowBits, highBits, unsigned);
		}
		/**
		* Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
		*  assumed to use 32 bits.
		* @function
		* @param {number} lowBits The low 32 bits
		* @param {number} highBits The high 32 bits
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @returns {!Long} The corresponding Long value
		*/
		Long.fromBits = fromBits;
		/**
		* @function
		* @param {number} base
		* @param {number} exponent
		* @returns {number}
		* @inner
		*/
		var pow_dbl = Math.pow;
		/**
		* @param {string} str
		* @param {(boolean|number)=} unsigned
		* @param {number=} radix
		* @returns {!Long}
		* @inner
		*/
		function fromString(str, unsigned, radix) {
			if (str.length === 0) throw Error("empty string");
			if (typeof unsigned === "number") {
				radix = unsigned;
				unsigned = false;
			} else unsigned = !!unsigned;
			if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity") return unsigned ? UZERO : ZERO;
			radix = radix || 10;
			if (radix < 2 || 36 < radix) throw RangeError("radix");
			var p;
			if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
			else if (p === 0) return fromString(str.substring(1), unsigned, radix).neg();
			var radixToPower = fromNumber(pow_dbl(radix, 8));
			var result = ZERO;
			for (var i = 0; i < str.length; i += 8) {
				var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
				if (size < 8) {
					var power = fromNumber(pow_dbl(radix, size));
					result = result.mul(power).add(fromNumber(value));
				} else {
					result = result.mul(radixToPower);
					result = result.add(fromNumber(value));
				}
			}
			result.unsigned = unsigned;
			return result;
		}
		/**
		* Returns a Long representation of the given string, written using the specified radix.
		* @function
		* @param {string} str The textual representation of the Long
		* @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
		* @param {number=} radix The radix in which the text is written (2-36), defaults to 10
		* @returns {!Long} The corresponding Long value
		*/
		Long.fromString = fromString;
		/**
		* @function
		* @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
		* @param {boolean=} unsigned
		* @returns {!Long}
		* @inner
		*/
		function fromValue(val, unsigned) {
			if (typeof val === "number") return fromNumber(val, unsigned);
			if (typeof val === "string") return fromString(val, unsigned);
			return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
		}
		/**
		* Converts the specified value to a Long using the appropriate from* function for its type.
		* @function
		* @param {!Long|number|bigint|string|!{low: number, high: number, unsigned: boolean}} val Value
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @returns {!Long}
		*/
		Long.fromValue = fromValue;
		/**
		* @type {number}
		* @const
		* @inner
		*/
		var TWO_PWR_16_DBL = 65536;
		/**
		* @type {number}
		* @const
		* @inner
		*/
		var TWO_PWR_24_DBL = 1 << 24;
		/**
		* @type {number}
		* @const
		* @inner
		*/
		var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
		/**
		* @type {number}
		* @const
		* @inner
		*/
		var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
		/**
		* @type {number}
		* @const
		* @inner
		*/
		var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
		/**
		* @type {!Long}
		* @const
		* @inner
		*/
		var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
		/**
		* @type {!Long}
		* @inner
		*/
		var ZERO = fromInt(0);
		/**
		* Signed zero.
		* @type {!Long}
		*/
		Long.ZERO = ZERO;
		/**
		* @type {!Long}
		* @inner
		*/
		var UZERO = fromInt(0, true);
		/**
		* Unsigned zero.
		* @type {!Long}
		*/
		Long.UZERO = UZERO;
		/**
		* @type {!Long}
		* @inner
		*/
		var ONE = fromInt(1);
		/**
		* Signed one.
		* @type {!Long}
		*/
		Long.ONE = ONE;
		/**
		* @type {!Long}
		* @inner
		*/
		var UONE = fromInt(1, true);
		/**
		* Unsigned one.
		* @type {!Long}
		*/
		Long.UONE = UONE;
		/**
		* @type {!Long}
		* @inner
		*/
		var NEG_ONE = fromInt(-1);
		/**
		* Signed negative one.
		* @type {!Long}
		*/
		Long.NEG_ONE = NEG_ONE;
		/**
		* @type {!Long}
		* @inner
		*/
		var MAX_VALUE = fromBits(-1, 2147483647, false);
		/**
		* Maximum signed value.
		* @type {!Long}
		*/
		Long.MAX_VALUE = MAX_VALUE;
		/**
		* @type {!Long}
		* @inner
		*/
		var MAX_UNSIGNED_VALUE = fromBits(-1, -1, true);
		/**
		* Maximum unsigned value.
		* @type {!Long}
		*/
		Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
		/**
		* @type {!Long}
		* @inner
		*/
		var MIN_VALUE = fromBits(0, -2147483648, false);
		/**
		* Minimum signed value.
		* @type {!Long}
		*/
		Long.MIN_VALUE = MIN_VALUE;
		/**
		* @alias Long.prototype
		* @inner
		*/
		var LongPrototype = Long.prototype;
		/**
		* Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
		* @this {!Long}
		* @returns {number}
		*/
		LongPrototype.toInt = function toInt() {
			return this.unsigned ? this.low >>> 0 : this.low;
		};
		/**
		* Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
		* @this {!Long}
		* @returns {number}
		*/
		LongPrototype.toNumber = function toNumber() {
			if (this.unsigned) return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
			return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
		};
		/**
		* Converts the Long to a string written in the specified radix.
		* @this {!Long}
		* @param {number=} radix Radix (2-36), defaults to 10
		* @returns {string}
		* @override
		* @throws {RangeError} If `radix` is out of range
		*/
		LongPrototype.toString = function toString(radix) {
			radix = radix || 10;
			if (radix < 2 || 36 < radix) throw RangeError("radix");
			if (this.isZero()) return "0";
			if (this.isNegative()) if (this.eq(MIN_VALUE)) {
				var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
				return div.toString(radix) + rem1.toInt().toString(radix);
			} else return "-" + this.neg().toString(radix);
			var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
			var result = "";
			while (true) {
				var remDiv = rem.div(radixToPower), digits = (rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0).toString(radix);
				rem = remDiv;
				if (rem.isZero()) return digits + result;
				else {
					while (digits.length < 6) digits = "0" + digits;
					result = "" + digits + result;
				}
			}
		};
		/**
		* Gets the high 32 bits as a signed integer.
		* @this {!Long}
		* @returns {number} Signed high bits
		*/
		LongPrototype.getHighBits = function getHighBits() {
			return this.high;
		};
		/**
		* Gets the high 32 bits as an unsigned integer.
		* @this {!Long}
		* @returns {number} Unsigned high bits
		*/
		LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
			return this.high >>> 0;
		};
		/**
		* Gets the low 32 bits as a signed integer.
		* @this {!Long}
		* @returns {number} Signed low bits
		*/
		LongPrototype.getLowBits = function getLowBits() {
			return this.low;
		};
		/**
		* Gets the low 32 bits as an unsigned integer.
		* @this {!Long}
		* @returns {number} Unsigned low bits
		*/
		LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
			return this.low >>> 0;
		};
		/**
		* Gets the number of bits needed to represent the absolute value of this Long.
		* @this {!Long}
		* @returns {number}
		*/
		LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
			if (this.isNegative()) return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
			var val = this.high != 0 ? this.high : this.low;
			for (var bit = 31; bit > 0; bit--) if ((val & 1 << bit) != 0) break;
			return this.high != 0 ? bit + 33 : bit + 1;
		};
		/**
		* Tests if this Long can be safely represented as a JavaScript number.
		* @this {!Long}
		* @returns {boolean}
		*/
		LongPrototype.isSafeInteger = function isSafeInteger() {
			var top11Bits = this.high >> 21;
			if (!top11Bits) return true;
			if (this.unsigned) return false;
			return top11Bits === -1 && !(this.low === 0 && this.high === -2097152);
		};
		/**
		* Tests if this Long's value equals zero.
		* @this {!Long}
		* @returns {boolean}
		*/
		LongPrototype.isZero = function isZero() {
			return this.high === 0 && this.low === 0;
		};
		/**
		* Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
		* @returns {boolean}
		*/
		LongPrototype.eqz = LongPrototype.isZero;
		/**
		* Tests if this Long's value is negative.
		* @this {!Long}
		* @returns {boolean}
		*/
		LongPrototype.isNegative = function isNegative() {
			return !this.unsigned && this.high < 0;
		};
		/**
		* Tests if this Long's value is positive or zero.
		* @this {!Long}
		* @returns {boolean}
		*/
		LongPrototype.isPositive = function isPositive() {
			return this.unsigned || this.high >= 0;
		};
		/**
		* Tests if this Long's value is odd.
		* @this {!Long}
		* @returns {boolean}
		*/
		LongPrototype.isOdd = function isOdd() {
			return (this.low & 1) === 1;
		};
		/**
		* Tests if this Long's value is even.
		* @this {!Long}
		* @returns {boolean}
		*/
		LongPrototype.isEven = function isEven() {
			return (this.low & 1) === 0;
		};
		/**
		* Tests if this Long's value equals the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.equals = function equals(other) {
			if (!isLong(other)) other = fromValue(other);
			if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1) return false;
			return this.high === other.high && this.low === other.low;
		};
		/**
		* Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.eq = LongPrototype.equals;
		/**
		* Tests if this Long's value differs from the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.notEquals = function notEquals(other) {
			return !this.eq(other);
		};
		/**
		* Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.neq = LongPrototype.notEquals;
		/**
		* Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.ne = LongPrototype.notEquals;
		/**
		* Tests if this Long's value is less than the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.lessThan = function lessThan(other) {
			return this.comp(other) < 0;
		};
		/**
		* Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.lt = LongPrototype.lessThan;
		/**
		* Tests if this Long's value is less than or equal the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
			return this.comp(other) <= 0;
		};
		/**
		* Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.lte = LongPrototype.lessThanOrEqual;
		/**
		* Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.le = LongPrototype.lessThanOrEqual;
		/**
		* Tests if this Long's value is greater than the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.greaterThan = function greaterThan(other) {
			return this.comp(other) > 0;
		};
		/**
		* Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.gt = LongPrototype.greaterThan;
		/**
		* Tests if this Long's value is greater than or equal the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
			return this.comp(other) >= 0;
		};
		/**
		* Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.gte = LongPrototype.greaterThanOrEqual;
		/**
		* Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.ge = LongPrototype.greaterThanOrEqual;
		/**
		* Compares this Long's value with the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {number} 0 if they are the same, 1 if the this is greater and -1
		*  if the given one is greater
		*/
		LongPrototype.compare = function compare(other) {
			if (!isLong(other)) other = fromValue(other);
			if (this.eq(other)) return 0;
			var thisNeg = this.isNegative(), otherNeg = other.isNegative();
			if (thisNeg && !otherNeg) return -1;
			if (!thisNeg && otherNeg) return 1;
			if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
			return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
		};
		/**
		* Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {number} 0 if they are the same, 1 if the this is greater and -1
		*  if the given one is greater
		*/
		LongPrototype.comp = LongPrototype.compare;
		/**
		* Negates this Long's value.
		* @this {!Long}
		* @returns {!Long} Negated Long
		*/
		LongPrototype.negate = function negate() {
			if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
			return this.not().add(ONE);
		};
		/**
		* Negates this Long's value. This is an alias of {@link Long#negate}.
		* @function
		* @returns {!Long} Negated Long
		*/
		LongPrototype.neg = LongPrototype.negate;
		/**
		* Returns the sum of this and the specified Long.
		* @this {!Long}
		* @param {!Long|number|bigint|string} addend Addend
		* @returns {!Long} Sum
		*/
		LongPrototype.add = function add(addend) {
			if (!isLong(addend)) addend = fromValue(addend);
			var a48 = this.high >>> 16;
			var a32 = this.high & 65535;
			var a16 = this.low >>> 16;
			var a00 = this.low & 65535;
			var b48 = addend.high >>> 16;
			var b32 = addend.high & 65535;
			var b16 = addend.low >>> 16;
			var b00 = addend.low & 65535;
			var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
			c00 += a00 + b00;
			c16 += c00 >>> 16;
			c00 &= 65535;
			c16 += a16 + b16;
			c32 += c16 >>> 16;
			c16 &= 65535;
			c32 += a32 + b32;
			c48 += c32 >>> 16;
			c32 &= 65535;
			c48 += a48 + b48;
			c48 &= 65535;
			return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
		};
		/**
		* Returns the difference of this and the specified Long.
		* @this {!Long}
		* @param {!Long|number|bigint|string} subtrahend Subtrahend
		* @returns {!Long} Difference
		*/
		LongPrototype.subtract = function subtract(subtrahend) {
			if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
			return this.add(subtrahend.neg());
		};
		/**
		* Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
		* @function
		* @param {!Long|number|bigint|string} subtrahend Subtrahend
		* @returns {!Long} Difference
		*/
		LongPrototype.sub = LongPrototype.subtract;
		/**
		* Returns the product of this and the specified Long.
		* @this {!Long}
		* @param {!Long|number|bigint|string} multiplier Multiplier
		* @returns {!Long} Product
		*/
		LongPrototype.multiply = function multiply(multiplier) {
			if (this.isZero()) return this;
			if (!isLong(multiplier)) multiplier = fromValue(multiplier);
			if (wasm) return fromBits(wasm["mul"](this.low, this.high, multiplier.low, multiplier.high), wasm["get_high"](), this.unsigned);
			if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
			if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
			if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
			if (this.isNegative()) if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
			else return this.neg().mul(multiplier).neg();
			else if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg();
			if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24)) return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
			var a48 = this.high >>> 16;
			var a32 = this.high & 65535;
			var a16 = this.low >>> 16;
			var a00 = this.low & 65535;
			var b48 = multiplier.high >>> 16;
			var b32 = multiplier.high & 65535;
			var b16 = multiplier.low >>> 16;
			var b00 = multiplier.low & 65535;
			var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
			c00 += a00 * b00;
			c16 += c00 >>> 16;
			c00 &= 65535;
			c16 += a16 * b00;
			c32 += c16 >>> 16;
			c16 &= 65535;
			c16 += a00 * b16;
			c32 += c16 >>> 16;
			c16 &= 65535;
			c32 += a32 * b00;
			c48 += c32 >>> 16;
			c32 &= 65535;
			c32 += a16 * b16;
			c48 += c32 >>> 16;
			c32 &= 65535;
			c32 += a00 * b32;
			c48 += c32 >>> 16;
			c32 &= 65535;
			c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
			c48 &= 65535;
			return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
		};
		/**
		* Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
		* @function
		* @param {!Long|number|bigint|string} multiplier Multiplier
		* @returns {!Long} Product
		*/
		LongPrototype.mul = LongPrototype.multiply;
		/**
		* Returns this Long divided by the specified. The result is signed if this Long is signed or
		*  unsigned if this Long is unsigned.
		* @this {!Long}
		* @param {!Long|number|bigint|string} divisor Divisor
		* @returns {!Long} Quotient
		*/
		LongPrototype.divide = function divide(divisor) {
			if (!isLong(divisor)) divisor = fromValue(divisor);
			if (divisor.isZero()) throw Error("division by zero");
			if (wasm) {
				if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) return this;
				return fromBits((this.unsigned ? wasm["div_u"] : wasm["div_s"])(this.low, this.high, divisor.low, divisor.high), wasm["get_high"](), this.unsigned);
			}
			if (this.isZero()) return this.unsigned ? UZERO : ZERO;
			var approx, rem, res;
			if (!this.unsigned) {
				if (this.eq(MIN_VALUE)) if (divisor.eq(ONE) || divisor.eq(NEG_ONE)) return MIN_VALUE;
				else if (divisor.eq(MIN_VALUE)) return ONE;
				else {
					approx = this.shr(1).div(divisor).shl(1);
					if (approx.eq(ZERO)) return divisor.isNegative() ? ONE : NEG_ONE;
					else {
						rem = this.sub(divisor.mul(approx));
						res = approx.add(rem.div(divisor));
						return res;
					}
				}
				else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
				if (this.isNegative()) {
					if (divisor.isNegative()) return this.neg().div(divisor.neg());
					return this.neg().div(divisor).neg();
				} else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
				res = ZERO;
			} else {
				if (!divisor.unsigned) divisor = divisor.toUnsigned();
				if (divisor.gt(this)) return UZERO;
				if (divisor.gt(this.shru(1))) return UONE;
				res = UZERO;
			}
			rem = this;
			while (rem.gte(divisor)) {
				approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
				var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
				while (approxRem.isNegative() || approxRem.gt(rem)) {
					approx -= delta;
					approxRes = fromNumber(approx, this.unsigned);
					approxRem = approxRes.mul(divisor);
				}
				if (approxRes.isZero()) approxRes = ONE;
				res = res.add(approxRes);
				rem = rem.sub(approxRem);
			}
			return res;
		};
		/**
		* Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
		* @function
		* @param {!Long|number|bigint|string} divisor Divisor
		* @returns {!Long} Quotient
		*/
		LongPrototype.div = LongPrototype.divide;
		/**
		* Returns this Long modulo the specified.
		* @this {!Long}
		* @param {!Long|number|bigint|string} divisor Divisor
		* @returns {!Long} Remainder
		*/
		LongPrototype.modulo = function modulo(divisor) {
			if (!isLong(divisor)) divisor = fromValue(divisor);
			if (wasm) return fromBits((this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(this.low, this.high, divisor.low, divisor.high), wasm["get_high"](), this.unsigned);
			return this.sub(this.div(divisor).mul(divisor));
		};
		/**
		* Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
		* @function
		* @param {!Long|number|bigint|string} divisor Divisor
		* @returns {!Long} Remainder
		*/
		LongPrototype.mod = LongPrototype.modulo;
		/**
		* Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
		* @function
		* @param {!Long|number|bigint|string} divisor Divisor
		* @returns {!Long} Remainder
		*/
		LongPrototype.rem = LongPrototype.modulo;
		/**
		* Returns the bitwise NOT of this Long.
		* @this {!Long}
		* @returns {!Long}
		*/
		LongPrototype.not = function not() {
			return fromBits(~this.low, ~this.high, this.unsigned);
		};
		/**
		* Returns count leading zeros of this Long.
		* @this {!Long}
		* @returns {!number}
		*/
		LongPrototype.countLeadingZeros = function countLeadingZeros() {
			return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
		};
		/**
		* Returns count leading zeros. This is an alias of {@link Long#countLeadingZeros}.
		* @function
		* @param {!Long}
		* @returns {!number}
		*/
		LongPrototype.clz = LongPrototype.countLeadingZeros;
		/**
		* Returns count trailing zeros of this Long.
		* @this {!Long}
		* @returns {!number}
		*/
		LongPrototype.countTrailingZeros = function countTrailingZeros() {
			return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
		};
		/**
		* Returns count trailing zeros. This is an alias of {@link Long#countTrailingZeros}.
		* @function
		* @param {!Long}
		* @returns {!number}
		*/
		LongPrototype.ctz = LongPrototype.countTrailingZeros;
		/**
		* Returns the bitwise AND of this Long and the specified.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other Long
		* @returns {!Long}
		*/
		LongPrototype.and = function and(other) {
			if (!isLong(other)) other = fromValue(other);
			return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
		};
		/**
		* Returns the bitwise OR of this Long and the specified.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other Long
		* @returns {!Long}
		*/
		LongPrototype.or = function or(other) {
			if (!isLong(other)) other = fromValue(other);
			return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
		};
		/**
		* Returns the bitwise XOR of this Long and the given one.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other Long
		* @returns {!Long}
		*/
		LongPrototype.xor = function xor(other) {
			if (!isLong(other)) other = fromValue(other);
			return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
		};
		/**
		* Returns this Long with bits shifted to the left by the given amount.
		* @this {!Long}
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shiftLeft = function shiftLeft(numBits) {
			if (isLong(numBits)) numBits = numBits.toInt();
			if ((numBits &= 63) === 0) return this;
			else if (numBits < 32) return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
			else return fromBits(0, this.low << numBits - 32, this.unsigned);
		};
		/**
		* Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
		* @function
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shl = LongPrototype.shiftLeft;
		/**
		* Returns this Long with bits arithmetically shifted to the right by the given amount.
		* @this {!Long}
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shiftRight = function shiftRight(numBits) {
			if (isLong(numBits)) numBits = numBits.toInt();
			if ((numBits &= 63) === 0) return this;
			else if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
			else return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
		};
		/**
		* Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
		* @function
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shr = LongPrototype.shiftRight;
		/**
		* Returns this Long with bits logically shifted to the right by the given amount.
		* @this {!Long}
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
			if (isLong(numBits)) numBits = numBits.toInt();
			if ((numBits &= 63) === 0) return this;
			if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned);
			if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
			return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
		};
		/**
		* Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
		* @function
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shru = LongPrototype.shiftRightUnsigned;
		/**
		* Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
		* @function
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
		/**
		* Returns this Long with bits rotated to the left by the given amount.
		* @this {!Long}
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Rotated Long
		*/
		LongPrototype.rotateLeft = function rotateLeft(numBits) {
			var b;
			if (isLong(numBits)) numBits = numBits.toInt();
			if ((numBits &= 63) === 0) return this;
			if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
			if (numBits < 32) {
				b = 32 - numBits;
				return fromBits(this.low << numBits | this.high >>> b, this.high << numBits | this.low >>> b, this.unsigned);
			}
			numBits -= 32;
			b = 32 - numBits;
			return fromBits(this.high << numBits | this.low >>> b, this.low << numBits | this.high >>> b, this.unsigned);
		};
		/**
		* Returns this Long with bits rotated to the left by the given amount. This is an alias of {@link Long#rotateLeft}.
		* @function
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Rotated Long
		*/
		LongPrototype.rotl = LongPrototype.rotateLeft;
		/**
		* Returns this Long with bits rotated to the right by the given amount.
		* @this {!Long}
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Rotated Long
		*/
		LongPrototype.rotateRight = function rotateRight(numBits) {
			var b;
			if (isLong(numBits)) numBits = numBits.toInt();
			if ((numBits &= 63) === 0) return this;
			if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
			if (numBits < 32) {
				b = 32 - numBits;
				return fromBits(this.high << b | this.low >>> numBits, this.low << b | this.high >>> numBits, this.unsigned);
			}
			numBits -= 32;
			b = 32 - numBits;
			return fromBits(this.low << b | this.high >>> numBits, this.high << b | this.low >>> numBits, this.unsigned);
		};
		/**
		* Returns this Long with bits rotated to the right by the given amount. This is an alias of {@link Long#rotateRight}.
		* @function
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Rotated Long
		*/
		LongPrototype.rotr = LongPrototype.rotateRight;
		/**
		* Converts this Long to signed.
		* @this {!Long}
		* @returns {!Long} Signed long
		*/
		LongPrototype.toSigned = function toSigned() {
			if (!this.unsigned) return this;
			return fromBits(this.low, this.high, false);
		};
		/**
		* Converts this Long to unsigned.
		* @this {!Long}
		* @returns {!Long} Unsigned long
		*/
		LongPrototype.toUnsigned = function toUnsigned() {
			if (this.unsigned) return this;
			return fromBits(this.low, this.high, true);
		};
		/**
		* Converts this Long to its byte representation.
		* @param {boolean=} le Whether little or big endian, defaults to big endian
		* @this {!Long}
		* @returns {!Array.<number>} Byte representation
		*/
		LongPrototype.toBytes = function toBytes(le) {
			return le ? this.toBytesLE() : this.toBytesBE();
		};
		/**
		* Converts this Long to its little endian byte representation.
		* @this {!Long}
		* @returns {!Array.<number>} Little endian byte representation
		*/
		LongPrototype.toBytesLE = function toBytesLE() {
			var hi = this.high, lo = this.low;
			return [
				lo & 255,
				lo >>> 8 & 255,
				lo >>> 16 & 255,
				lo >>> 24,
				hi & 255,
				hi >>> 8 & 255,
				hi >>> 16 & 255,
				hi >>> 24
			];
		};
		/**
		* Converts this Long to its big endian byte representation.
		* @this {!Long}
		* @returns {!Array.<number>} Big endian byte representation
		*/
		LongPrototype.toBytesBE = function toBytesBE() {
			var hi = this.high, lo = this.low;
			return [
				hi >>> 24,
				hi >>> 16 & 255,
				hi >>> 8 & 255,
				hi & 255,
				lo >>> 24,
				lo >>> 16 & 255,
				lo >>> 8 & 255,
				lo & 255
			];
		};
		/**
		* Creates a Long from its byte representation.
		* @param {!Array.<number>} bytes Byte representation
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @param {boolean=} le Whether little or big endian, defaults to big endian
		* @returns {Long} The corresponding Long value
		*/
		Long.fromBytes = function fromBytes(bytes, unsigned, le) {
			return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
		};
		/**
		* Creates a Long from its little endian byte representation.
		* @param {!Array.<number>} bytes Little endian byte representation
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @returns {Long} The corresponding Long value
		*/
		Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
			return new Long(bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24, bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24, unsigned);
		};
		/**
		* Creates a Long from its big endian byte representation.
		* @param {!Array.<number>} bytes Big endian byte representation
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @returns {Long} The corresponding Long value
		*/
		Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
			return new Long(bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7], bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], unsigned);
		};
		if (typeof BigInt === "function") {
			/**
			* Returns a Long representing the given big integer.
			* @function
			* @param {number} value The big integer value
			* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
			* @returns {!Long} The corresponding Long value
			*/
			Long.fromBigInt = function fromBigInt(value, unsigned) {
				return fromBits(Number(BigInt.asIntN(32, value)), Number(BigInt.asIntN(32, value >> BigInt(32))), unsigned);
			};
			Long.fromValue = function fromValueWithBigInt(value, unsigned) {
				if (typeof value === "bigint") return Long.fromBigInt(value, unsigned);
				return fromValue(value, unsigned);
			};
			/**
			* Converts the Long to its big integer representation.
			* @this {!Long}
			* @returns {bigint}
			*/
			LongPrototype.toBigInt = function toBigInt() {
				var lowBigInt = BigInt(this.low >>> 0);
				return BigInt(this.unsigned ? this.high >>> 0 : this.high) << BigInt(32) | lowBigInt;
			};
		}
		_exports.default = Long;
	});
})))();
function createBaseTraceContext() {
	return {
		traceId: "",
		spanId: "",
		traceFlags: "",
		traceState: ""
	};
}
const TraceContext = {
	encode(message, writer = new BinaryWriter()) {
		if (message.traceId !== "") writer.uint32(10).string(message.traceId);
		if (message.spanId !== "") writer.uint32(18).string(message.spanId);
		if (message.traceFlags !== "") writer.uint32(26).string(message.traceFlags);
		if (message.traceState !== "") writer.uint32(34).string(message.traceState);
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
			traceState: isSet$1(object.traceState) ? globalThis.String(object.traceState) : ""
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.traceId !== "") obj.traceId = message.traceId;
		if (message.spanId !== "") obj.spanId = message.spanId;
		if (message.traceFlags !== "") obj.traceFlags = message.traceFlags;
		if (message.traceState !== "") obj.traceState = message.traceState;
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
		return message;
	}
};
function createBaseMetadata() {
	return {
		id: "",
		createdAt: "",
		traceContext: void 0
	};
}
const Metadata = {
	encode(message, writer = new BinaryWriter()) {
		if (message.id !== "") writer.uint32(10).string(message.id);
		if (message.createdAt !== "") writer.uint32(18).string(message.createdAt);
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
				case 2:
					if (tag !== 18) break;
					message.createdAt = reader.string();
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
			createdAt: isSet$1(object.createdAt) ? globalThis.String(object.createdAt) : "",
			traceContext: isSet$1(object.traceContext) ? TraceContext.fromJSON(object.traceContext) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.id !== "") obj.id = message.id;
		if (message.createdAt !== "") obj.createdAt = message.createdAt;
		if (message.traceContext !== void 0) obj.traceContext = TraceContext.toJSON(message.traceContext);
		return obj;
	},
	create(base) {
		return Metadata.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseMetadata();
		message.id = object.id ?? "";
		message.createdAt = object.createdAt ?? "";
		message.traceContext = object.traceContext !== void 0 && object.traceContext !== null ? TraceContext.fromPartial(object.traceContext) : void 0;
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
function createBaseHashRequest() {
	return {
		profile: "",
		input: new Uint8Array(0),
		metadata: void 0
	};
}
const HashRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.profile !== "") writer.uint32(10).string(message.profile);
		if (message.input.length !== 0) writer.uint32(18).bytes(message.input);
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(26).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseHashRequest();
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
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			profile: isSet$1(object.profile) ? globalThis.String(object.profile) : "",
			input: isSet$1(object.input) ? bytesFromBase64(object.input) : new Uint8Array(0),
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.profile !== "") obj.profile = message.profile;
		if (message.input.length !== 0) obj.input = base64FromBytes(message.input);
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		return obj;
	},
	create(base) {
		return HashRequest.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseHashRequest();
		message.profile = object.profile ?? "";
		message.input = object.input ?? new Uint8Array(0);
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		return message;
	}
};
function createBaseHashResponse() {
	return {
		hashValue: "",
		hashAlgorithm: "",
		metadata: void 0
	};
}
const HashResponse = {
	encode(message, writer = new BinaryWriter()) {
		if (message.hashValue !== "") writer.uint32(10).string(message.hashValue);
		if (message.hashAlgorithm !== "") writer.uint32(18).string(message.hashAlgorithm);
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(26).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseHashResponse();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.hashValue = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.hashAlgorithm = reader.string();
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
			hashValue: isSet$1(object.hashValue) ? globalThis.String(object.hashValue) : "",
			hashAlgorithm: isSet$1(object.hashAlgorithm) ? globalThis.String(object.hashAlgorithm) : "",
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.hashValue !== "") obj.hashValue = message.hashValue;
		if (message.hashAlgorithm !== "") obj.hashAlgorithm = message.hashAlgorithm;
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		return obj;
	},
	create(base) {
		return HashResponse.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseHashResponse();
		message.hashValue = object.hashValue ?? "";
		message.hashAlgorithm = object.hashAlgorithm ?? "";
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		return message;
	}
};
function createBaseSignRequest() {
	return {
		profile: "",
		csr: "",
		caPrivateKey: "",
		caCert: "",
		metadata: void 0,
		validNotBefore: void 0,
		validNotAfter: void 0,
		subject: void 0,
		crlDistributionPoints: []
	};
}
const SignRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.profile !== "") writer.uint32(10).string(message.profile);
		if (message.csr !== "") writer.uint32(18).string(message.csr);
		if (message.caPrivateKey !== "") writer.uint32(26).string(message.caPrivateKey);
		if (message.caCert !== "") writer.uint32(34).string(message.caCert);
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(42).fork()).join();
		if (message.validNotBefore !== void 0) writer.uint32(48).uint64(message.validNotBefore.toString());
		if (message.validNotAfter !== void 0) writer.uint32(56).uint64(message.validNotAfter.toString());
		if (message.subject !== void 0) writer.uint32(66).string(message.subject);
		for (const v of message.crlDistributionPoints) writer.uint32(74).string(v);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseSignRequest();
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
					message.validNotBefore = Long.fromString(reader.uint64().toString(), true);
					continue;
				case 7:
					if (tag !== 56) break;
					message.validNotAfter = Long.fromString(reader.uint64().toString(), true);
					continue;
				case 8:
					if (tag !== 66) break;
					message.subject = reader.string();
					continue;
				case 9:
					if (tag !== 74) break;
					message.crlDistributionPoints.push(reader.string());
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
			validNotBefore: isSet$1(object.validNotBefore) ? Long.fromValue(object.validNotBefore) : void 0,
			validNotAfter: isSet$1(object.validNotAfter) ? Long.fromValue(object.validNotAfter) : void 0,
			subject: isSet$1(object.subject) ? globalThis.String(object.subject) : void 0,
			crlDistributionPoints: globalThis.Array.isArray(object?.crlDistributionPoints) ? object.crlDistributionPoints.map((e) => globalThis.String(e)) : []
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.profile !== "") obj.profile = message.profile;
		if (message.csr !== "") obj.csr = message.csr;
		if (message.caPrivateKey !== "") obj.caPrivateKey = message.caPrivateKey;
		if (message.caCert !== "") obj.caCert = message.caCert;
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		if (message.validNotBefore !== void 0) obj.validNotBefore = (message.validNotBefore || Long.UZERO).toString();
		if (message.validNotAfter !== void 0) obj.validNotAfter = (message.validNotAfter || Long.UZERO).toString();
		if (message.subject !== void 0) obj.subject = message.subject;
		if (message.crlDistributionPoints?.length) obj.crlDistributionPoints = message.crlDistributionPoints;
		return obj;
	},
	create(base) {
		return SignRequest.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseSignRequest();
		message.profile = object.profile ?? "";
		message.csr = object.csr ?? "";
		message.caPrivateKey = object.caPrivateKey ?? "";
		message.caCert = object.caCert ?? "";
		message.metadata = object.metadata !== void 0 && object.metadata !== null ? Metadata.fromPartial(object.metadata) : void 0;
		message.validNotBefore = object.validNotBefore !== void 0 && object.validNotBefore !== null ? Long.fromValue(object.validNotBefore) : void 0;
		message.validNotAfter = object.validNotAfter !== void 0 && object.validNotAfter !== null ? Long.fromValue(object.validNotAfter) : void 0;
		message.subject = object.subject ?? void 0;
		message.crlDistributionPoints = object.crlDistributionPoints?.map((e) => e) || [];
		return message;
	}
};
function createBaseSignResponse() {
	return {
		signedCertificate: "",
		metadata: void 0
	};
}
const SignResponse = {
	encode(message, writer = new BinaryWriter()) {
		if (message.signedCertificate !== "") writer.uint32(10).string(message.signedCertificate);
		if (message.metadata !== void 0) Metadata.encode(message.metadata, writer.uint32(18).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseSignResponse();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.signedCertificate = reader.string();
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
			signedCertificate: isSet$1(object.signedCertificate) ? globalThis.String(object.signedCertificate) : "",
			metadata: isSet$1(object.metadata) ? Metadata.fromJSON(object.metadata) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.signedCertificate !== "") obj.signedCertificate = message.signedCertificate;
		if (message.metadata !== void 0) obj.metadata = Metadata.toJSON(message.metadata);
		return obj;
	},
	create(base) {
		return SignResponse.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseSignResponse();
		message.signedCertificate = object.signedCertificate ?? "";
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
		this.Benchmark = this.Benchmark.bind(this);
		this.Hash = this.Hash.bind(this);
		this.Sign = this.Sign.bind(this);
		this.FakeEndpoint = this.FakeEndpoint.bind(this);
	}
	Benchmark(request) {
		const data = BenchmarkRequest.encode(request).finish();
		return this.rpc.request(this.service, "Benchmark", data).then((data) => BenchmarkResponse.decode(new BinaryReader(data)));
	}
	Hash(request) {
		const data = HashRequest.encode(request).finish();
		return this.rpc.request(this.service, "Hash", data).then((data) => HashResponse.decode(new BinaryReader(data)));
	}
	Sign(request) {
		const data = SignRequest.encode(request).finish();
		return this.rpc.request(this.service, "Sign", data).then((data) => SignResponse.decode(new BinaryReader(data)));
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
let HealthCheckResponse_ServingStatus = /* @__PURE__ */ function(HealthCheckResponse_ServingStatus) {
	HealthCheckResponse_ServingStatus[HealthCheckResponse_ServingStatus["UNKNOWN"] = 0] = "UNKNOWN";
	HealthCheckResponse_ServingStatus[HealthCheckResponse_ServingStatus["SERVING"] = 1] = "SERVING";
	HealthCheckResponse_ServingStatus[HealthCheckResponse_ServingStatus["NOT_SERVING"] = 2] = "NOT_SERVING";
	/** SERVICE_UNKNOWN - Used only by the Watch method. */
	HealthCheckResponse_ServingStatus[HealthCheckResponse_ServingStatus["SERVICE_UNKNOWN"] = 3] = "SERVICE_UNKNOWN";
	HealthCheckResponse_ServingStatus[HealthCheckResponse_ServingStatus["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
	return HealthCheckResponse_ServingStatus;
}({});
function healthCheckResponse_ServingStatusFromJSON(object) {
	switch (object) {
		case 0:
		case "UNKNOWN": return HealthCheckResponse_ServingStatus.UNKNOWN;
		case 1:
		case "SERVING": return HealthCheckResponse_ServingStatus.SERVING;
		case 2:
		case "NOT_SERVING": return HealthCheckResponse_ServingStatus.NOT_SERVING;
		case 3:
		case "SERVICE_UNKNOWN": return HealthCheckResponse_ServingStatus.SERVICE_UNKNOWN;
		default: return HealthCheckResponse_ServingStatus.UNRECOGNIZED;
	}
}
function healthCheckResponse_ServingStatusToJSON(object) {
	switch (object) {
		case HealthCheckResponse_ServingStatus.UNKNOWN: return "UNKNOWN";
		case HealthCheckResponse_ServingStatus.SERVING: return "SERVING";
		case HealthCheckResponse_ServingStatus.NOT_SERVING: return "NOT_SERVING";
		case HealthCheckResponse_ServingStatus.SERVICE_UNKNOWN: return "SERVICE_UNKNOWN";
		case HealthCheckResponse_ServingStatus.UNRECOGNIZED:
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
			switch (tag >>> 3) {}
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
//#region src/lib/client.ts
let CertEncoding = /* @__PURE__ */ function(CertEncoding) {
	CertEncoding["B64"] = "B64";
	CertEncoding["PEM"] = "PEM";
	return CertEncoding;
}({});
const encoders = {
	[CertEncoding.B64]: (input) => input,
	[CertEncoding.PEM]: (input) => {
		input.signedCertificate = new x509.X509Certificate(input.signedCertificate).toString();
		return input;
	}
};
var CryptoBrokerClient = class {
	client;
	healthClient;
	address;
	conn;
	constructor(opts = {}) {
		this.address = "unix:/tmp/open-crypto-broker/crypto-broker-server.sock";
		const client_options = opts.options || {};
		client_options["grpc.service_config"] = JSON.stringify(serviceConfig);
		this.conn = new grpc.Client(this.address, opts.credentials || grpc.credentials.createInsecure(), client_options);
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
	}
	async ready() {
		const conn_max_retries = 60;
		const conn_retry_delay_ms = 1e3;
		for (let attempt = 1; attempt <= conn_max_retries; attempt++) {
			const deadline = Date.now() + conn_retry_delay_ms;
			try {
				await new Promise((resolve, reject) => {
					this.conn.waitForReady(deadline, (err) => err ? reject(err) : resolve());
				});
				return;
			} catch {
				console.log(`Could not establish connection. Retrying... (${attempt}/${conn_max_retries})`);
			}
		}
		throw new Error("retry limit reached");
	}
	async benchmarkData(payload) {
		const req = { metadata: {
			id: payload.metadata?.id || v4(),
			createdAt: payload.metadata?.createdAt || (/* @__PURE__ */ new Date()).toString(),
			...payload.metadata?.traceContext !== void 0 && { traceContext: payload.metadata?.traceContext }
		} };
		return this.client.Benchmark(req).then((res) => res);
	}
	async hashData(payload) {
		const req = {
			profile: payload.profile,
			input: payload.input,
			metadata: {
				id: payload.metadata?.id || v4(),
				createdAt: payload.metadata?.createdAt || (/* @__PURE__ */ new Date()).toString(),
				...payload.metadata?.traceContext !== void 0 && { traceContext: payload.metadata?.traceContext }
			}
		};
		return this.client.Hash(req).then((res) => res);
	}
	async signCertificate(payload, options) {
		const req = {
			profile: payload.profile,
			csr: payload.csr,
			caPrivateKey: payload.caPrivateKey,
			caCert: payload.caCert,
			metadata: {
				id: payload.metadata?.id || v4(),
				createdAt: payload.metadata?.createdAt || (/* @__PURE__ */ new Date()).toString(),
				...payload.metadata?.traceContext !== void 0 && { traceContext: payload.metadata?.traceContext }
			},
			validNotBefore: payload.validNotBefore,
			validNotAfter: payload.validNotAfter,
			subject: payload.subject,
			crlDistributionPoints: payload.crlDistributionPoints || []
		};
		const encoding = options && options.encoding || CertEncoding.PEM;
		return this.client.Sign(req).then((res) => encoders[encoding](res));
	}
	async healthData() {
		const req = { service: "" };
		const status_unknown = { status: HealthCheckResponse_ServingStatus.UNKNOWN };
		return this.healthClient.Check(req).then((res) => res).catch(() => status_unknown);
	}
};
const credentials = grpc.credentials;
//#endregion
export { CertEncoding, CryptoBrokerClient, HealthCheckResponse_ServingStatus, credentials };

//# sourceMappingURL=client.mjs.map