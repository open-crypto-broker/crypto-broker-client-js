import type {
  BenchmarkPayload,
  EncryptDataPayload,
  DecryptDataPayload,
  HashDataPayload,
  Metadata,
  SignCertificatePayload,
} from './client.js';
import {
  HashOutputFormat as HashDataOutputFormat,
  SignOutputFormat as SignCertificateOutputFormat,
  PayloadLimits,
} from './proto/messages.js';

const maxProfileNameLen = PayloadLimits.PAYLOAD_LIMITS_PROFILE_MAX_LEN;
const maxHashDataInputBytes =
  PayloadLimits.PAYLOAD_LIMITS_HASH_DATA_INPUT_MAX_LEN;
const maxCSRBytes = PayloadLimits.PAYLOAD_LIMITS_SIGN_CERTIFICATE_CSR_MAX_LEN;
const maxCAPrivateKeyBytes =
  PayloadLimits.PAYLOAD_LIMITS_SIGN_CERTIFICATE_CA_PRIVATE_KEY_MAX_LEN;
const maxCACertBytes =
  PayloadLimits.PAYLOAD_LIMITS_SIGN_CERTIFICATE_CA_CERT_MAX_LEN;
const maxSubjectLen =
  PayloadLimits.PAYLOAD_LIMITS_SIGN_CERTIFICATE_SUBJECT_MAX_LEN;
const maxCRLDistributionPoints =
  PayloadLimits.PAYLOAD_LIMITS_SIGN_CERTIFICATE_DISTRIBUTION_POINTS_MAX;
const maxCRLDistributionPointLen =
  PayloadLimits.PAYLOAD_LIMITS_SIGN_CERTIFICATE_DISTRIBUTION_POINT_MAX_LEN;
const maxKeyIdLen =
  PayloadLimits.PAYLOAD_LIMITS_ENCRYPT_DECRYPT_DATA_KEYSOURCE_KEY_ID_MAX_LEN;
const maxMetadataIdLen = PayloadLimits.PAYLOAD_LIMITS_METADATA_ID_MAX_LEN;
const maxTraceIdLen = PayloadLimits.PAYLOAD_LIMITS_TRACE_ID_MAX_LEN;
const maxSpanIdLen = PayloadLimits.PAYLOAD_LIMITS_TRACE_SPAN_ID_MAX_LEN;
const maxTraceFlagsLen = PayloadLimits.PAYLOAD_LIMITS_TRACE_FLAGS_MAX_LEN;
const maxTraceStateLen = PayloadLimits.PAYLOAD_LIMITS_TRACE_STATE_MAX_LEN;
const maxCorrelationIdLen =
  PayloadLimits.PAYLOAD_LIMITS_TRACE_CORRELATION_ID_MAX_LEN;
const maxUint64 = BigInt('18446744073709551615');

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
): string[] {
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

function assertOptionalUint64(value: unknown, field: string) {
  if (value === undefined) {
    return;
  }

  if (typeof value === 'bigint') {
    if (value < 0n || value > maxUint64) {
      throw typeError(field, 'must be a uint64-compatible value');
    }
    return;
  }

  if (typeof value === 'number') {
    if (
      !Number.isSafeInteger(value) ||
      value < 0 ||
      value > Number.MAX_SAFE_INTEGER
    ) {
      throw typeError(field, 'must be a uint64-compatible value');
    }
    return;
  }

  throw typeError(field, 'must be a uint64-compatible value');
}

function assertUint8Array(
  value: unknown,
  field: string,
): asserts value is Uint8Array {
  if (!(value instanceof Uint8Array)) {
    throw typeError(field, 'must be Uint8Array');
  }
}
function assertOptionalUint8Array(
  value: unknown,
  field: string,
): asserts value is Uint8Array | undefined {
  if (value === undefined) {
    return;
  }
  assertUint8Array(value, field);
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

export function validateHashDataPayload(
  payload: unknown,
): asserts payload is HashDataPayload {
  assertObject(payload, 'payload');
  assertString(payload.profile, 'profile', maxProfileNameLen, true);
  assertEnumValue(payload.outputFormat, HashDataOutputFormat, 'outputFormat');
  assertUint8Array(payload.input, 'input');

  if (payload.input.length > maxHashDataInputBytes) {
    throw typeError('input', `too large (max ${maxHashDataInputBytes})`);
  }

  validateMetadata(payload.metadata as Metadata | undefined);
}

export function validateSignCertificatePayload(
  payload: unknown,
): asserts payload is SignCertificatePayload {
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
  assertEnumValue(
    payload.outputFormat,
    SignCertificateOutputFormat,
    'outputFormat',
  );

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

export function validateEncryptDataPayload(
  payload: unknown,
): asserts payload is EncryptDataPayload {
  assertObject(payload, 'payload');
  assertString(payload.profile, 'profile', maxProfileNameLen, true);
  assertObject(payload.keySource, 'keySource');
  assertOptionalString(payload.keySource.keyId, 'keySource.keyId', maxKeyIdLen);
  assertOptionalUint8Array(payload.keySource.rawKey, 'keySource.rawKey');
  assertUint8Array(payload.plaintext, 'plaintext');
  assertObject(payload.encryptMetadata, 'encryptMetadata');
  assertUint8Array(payload.encryptMetadata.nonce, 'encryptMetadata.nonce');
  assertOptionalUint8Array(payload.encryptMetadata.aad, 'encryptMetadata.aad');

  if (
    payload.keySource.keyId === undefined &&
    payload.keySource.rawKey === undefined
  ) {
    throw typeError(
      'keySource',
      'missing key source - either keyId or rawKey must be provided',
    );
  }
  if (
    payload.keySource.keyId !== undefined &&
    payload.keySource.rawKey !== undefined
  ) {
    throw typeError(
      'keySource',
      'too many key sources - either keyId or rawKey must be provided',
    );
  }

  validateMetadata(payload.metadata as Metadata | undefined);
}
export function validateDecryptDataPayload(
  payload: unknown,
): asserts payload is DecryptDataPayload {
  assertObject(payload, 'payload');
  assertString(payload.profile, 'profile', maxProfileNameLen, true);
  assertObject(payload.keySource, 'keySource');
  assertOptionalString(payload.keySource.keyId, 'keySource.keyId', maxKeyIdLen);
  assertOptionalUint8Array(payload.keySource.rawKey, 'keySource.rawKey');
  assertUint8Array(payload.ciphertext, 'ciphertext');
  assertObject(payload.decryptMetadata, 'decryptMetadata');
  assertUint8Array(payload.decryptMetadata.nonce, 'decryptMetadata.nonce');
  assertOptionalUint8Array(payload.decryptMetadata.aad, 'decryptMetadata.aad');
  assertOptionalUint8Array(payload.decryptMetadata.tag, 'decryptMetadata.tag');

  if (
    payload.keySource.keyId === undefined &&
    payload.keySource.rawKey === undefined
  ) {
    throw typeError(
      'keySource',
      'missing key source - either keyId or rawKey must be provided',
    );
  }
  if (
    payload.keySource.keyId !== undefined &&
    payload.keySource.rawKey !== undefined
  ) {
    throw typeError(
      'keySource',
      'too many key sources - either keyId or rawKey must be provided',
    );
  }

  validateMetadata(payload.metadata as Metadata | undefined);
}
