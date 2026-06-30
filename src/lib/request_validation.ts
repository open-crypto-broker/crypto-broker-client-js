import type {
  BenchmarkPayload,
  HashPayload,
  Metadata,
  SignPayload,
} from './client.js';

const maxProfileNameLen = 64;
const maxHashInputBytes = 1 << 20;
const maxCSRBytes = 64 << 10;
const maxCAPrivateKeyBytes = 64 << 10;
const maxCACertBytes = 64 << 10;
const maxSubjectLen = 1024;
const maxCRLDistributionPoints = 16;
const maxCRLDistributionPointLen = 2048;
const maxMetadataIdLen = 128;
const maxTraceIdLen = 32;
const maxSpanIdLen = 16;
const maxTraceFlagsLen = 2;
const maxTraceStateLen = 512;
const maxCorrelationIdLen = 128;
const maxUint64 = BigInt('18446744073709551615');

export enum HashOutputFormat {
  HEX = 0,
  RAW = 1,
  UNRECOGNIZED = -1,
}

export enum SignOutputFormat {
  DER = 0,
  PEM = 1,
  UNRECOGNIZED = -1,
}

function typeError(field: string, msg: string): TypeError {
  return new TypeError(`${field}: ${msg}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertObject(
  value: unknown,
  field: string,
): asserts value is Record<string, unknown> {
  if (!isRecord(value)) {
    throw typeError(field, 'must be an object');
  }
}

function assertString(
  value: unknown,
  field: string,
  max: number,
  required = false,
): void {
  if (typeof value !== 'string') {
    throw typeError(field, 'must be a string');
  }
  if (required && value === '') {
    throw typeError(field, 'required');
  }
  if (value.length > max) {
    throw typeError(field, `too large (max ${max})`);
  }
}

function assertOptionalString(
  value: unknown,
  field: string,
  max: number,
): void {
  if (value === undefined) {
    return;
  }
  assertString(value, field, max);
}

function enumKeysToStringArray<E extends Record<string, string | number>>(
  enumType: E,
) {
  return Object.keys(enumType)
    .filter((key) => isNaN(Number(key)))
    .filter((key) => key !== 'UNRECOGNIZED'); // do not accept -1
}
function assertEnumValue<E extends Record<string, string | number>>(
  value: unknown,
  enumType: E,
  field: string,
): asserts value is E[keyof E] {
  const values = Object.values(enumType)
    .filter((v): v is number => typeof v === 'number')
    .filter((v) => v != -1);

  const stringValues = enumKeysToStringArray(enumType);
  if (!values.includes(value as number)) {
    throw typeError(field, `must be one of: ${stringValues.join(', ')}`);
  }
}

function assertOptionalUint64(value: unknown, field: string): void {
  if (value === undefined) {
    return;
  }

  if (!isRecord(value) || typeof value.toString !== 'function') {
    throw typeError(field, 'must be a Long-compatible uint64 value');
  }

  const asString = value.toString();
  if (!/^\d+$/.test(asString) || BigInt(asString) > maxUint64) {
    throw typeError(field, 'must be a uint64 value');
  }
}

function validateMetadata(metadata: unknown): void {
  if (metadata === undefined) {
    return;
  }
  assertObject(metadata, 'metadata');
  assertOptionalString(metadata.id, 'metadata.id', maxMetadataIdLen);

  if (metadata.traceContext === undefined) {
    return;
  }
  assertObject(metadata.traceContext, 'metadata.traceContext');
  assertString(
    metadata.traceContext.traceId,
    'metadata.traceContext.traceId',
    maxTraceIdLen,
  );
  assertString(
    metadata.traceContext.spanId,
    'metadata.traceContext.spanId',
    maxSpanIdLen,
  );
  assertString(
    metadata.traceContext.traceFlags,
    'metadata.traceContext.traceFlags',
    maxTraceFlagsLen,
  );
  assertString(
    metadata.traceContext.traceState,
    'metadata.traceContext.traceState',
    maxTraceStateLen,
  );
  assertString(
    metadata.traceContext.correlationId,
    'metadata.traceContext.correlationId',
    maxCorrelationIdLen,
  );
}

export function validateBenchmarkPayload(
  payload: unknown,
): asserts payload is BenchmarkPayload {
  assertObject(payload, 'payload');
  validateMetadata(payload.metadata as Metadata | undefined);
}

export function validateHashPayload(
  payload: unknown,
): asserts payload is HashPayload {
  assertObject(payload, 'payload');
  assertString(payload.profile, 'profile', maxProfileNameLen, true);
  assertEnumValue(payload.outputFormat, HashOutputFormat, 'outputFormat');

  if (!(payload.input instanceof Uint8Array)) {
    throw typeError('input', 'must be a Uint8Array');
  }
  if (payload.input.length > maxHashInputBytes) {
    throw typeError('input', `too large (max ${maxHashInputBytes})`);
  }

  validateMetadata(payload.metadata as Metadata | undefined);
}

export function validateSignPayload(
  payload: unknown,
): asserts payload is SignPayload {
  assertObject(payload, 'payload');
  assertString(payload.profile, 'profile', maxProfileNameLen, true);
  assertString(payload.csr, 'csr', maxCSRBytes, true);
  assertString(
    payload.caPrivateKey,
    'caPrivateKey',
    maxCAPrivateKeyBytes,
    true,
  );
  assertString(payload.caCert, 'caCert', maxCACertBytes, true);
  assertOptionalUint64(payload.validNotBefore, 'validNotBefore');
  assertOptionalUint64(payload.validNotAfter, 'validNotAfter');
  assertOptionalString(payload.subject, 'subject', maxSubjectLen);
  assertEnumValue(payload.outputFormat, SignOutputFormat, 'outputFormat');

  if (payload.crlDistributionPoints !== undefined) {
    if (!Array.isArray(payload.crlDistributionPoints)) {
      throw typeError('crlDistributionPoints', 'must be an array');
    }
    if (payload.crlDistributionPoints.length > maxCRLDistributionPoints) {
      throw typeError(
        'crlDistributionPoints',
        `too many entries (max ${maxCRLDistributionPoints})`,
      );
    }
    payload.crlDistributionPoints.forEach((value, index) => {
      assertString(
        value,
        `crlDistributionPoints[${index}]`,
        maxCRLDistributionPointLen,
      );
    });
  }

  validateMetadata(payload.metadata as Metadata | undefined);
}
