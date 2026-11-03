import { createHash } from 'node:crypto';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  CryptoBrokerClient,
  HashDataOutputFormat,
  HashDataPayload,
} from '../client.js';
import {
  HashDataRequest,
  PayloadLimits,
  HashDataResponse,
} from '../proto/cryptobroker/v1/messages.js';
import { isUUID4 } from './client.test-utils.js';

describe('CryptoBrokerClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const client: CryptoBrokerClient = new CryptoBrokerClient({
    circuitBreakerOptions: {
      enabled: false,
    },
  });

  it('should return a mocked hash data response', async () => {
    const payload = {
      profile: 'Default',
      input: Buffer.from('Hello world'),
      metadata: { id: 'mocked-id' },
      outputFormat: HashDataOutputFormat.HASH_OUTPUT_FORMAT_HEX,
    };
    const response: HashDataResponse = await client.hashData(payload);

    // Test that the response matches what is expected
    expect(response).toEqual({
      hashValueHex:
        'e2e1c9e522efb2495a178434c8bb8f11000ca23f1fd679058b7d7e141f0cf3433f94fc427ec0b9bebb12f327a3240021053db6091196576d5e6d9bd8fac71c0c',
      descriptor: {
        profile: 'Default',
        operation: 'HashData',
        algorithm: 'sha3-512',
      },
      metadata: { id: 'mocked-id' },
    });
    expect(response.hashValueHex).toBe(
      createHash('sha3-512').update(payload.input).digest('hex'),
    );
    expect(client['client'].HashData).toHaveBeenCalledWith(payload);
  });
  it('should return the canonical raw hash digest', async () => {
    const payload: HashDataRequest = {
      profile: 'Default',
      input: Buffer.from('Hello world'),
      metadata: { id: 'mocked-id' },
      outputFormat: HashDataOutputFormat.HASH_OUTPUT_FORMAT_RAW,
    };
    const response = await client.hashData(payload);
    expect(response.hashValueRaw).toEqual(
      createHash('sha3-512').update(payload.input).digest(),
    );
    expect(response.descriptor?.algorithm).toBe('sha3-512');
    expect(client['client'].HashData).toHaveBeenCalledWith(payload);
  });

  it('should accept an explicitly empty input', async () => {
    const payload = {
      profile: 'Default',
      input: new Uint8Array(),
      outputFormat: HashDataOutputFormat.HASH_OUTPUT_FORMAT_HEX,
    };
    await client.hashData(payload);
    expect(client['client'].HashData).toHaveBeenCalledWith(
      expect.objectContaining(payload),
    );
  });

  it.each<[Partial<HashDataRequest>, string]>([
    [
      { profile: 'A'.repeat(PayloadLimits.PAYLOAD_LIMITS_PROFILE_MAX_LEN + 1) },
      'profile',
    ],
    [
      {
        input: new Uint8Array(
          PayloadLimits.PAYLOAD_LIMITS_HASH_DATA_INPUT_MAX_LEN + 1,
        ),
      },
      'input',
    ],
    [{ outputFormat: HashDataOutputFormat.UNRECOGNIZED }, 'outputFormat'],
  ])('should reject invalid hash fields (%#)', async (fields, field) => {
    await expect(
      client.hashData({
        profile: 'Default',
        input: Buffer.from('Hello world'),
        outputFormat: HashDataOutputFormat.HASH_OUTPUT_FORMAT_HEX,
        ...fields,
      } as HashDataRequest),
    ).rejects.toThrow(field);
    expect(client['client'].HashData).not.toHaveBeenCalled();
  });

  it('should reject invalid hash data payloads before making a request', async () => {
    await expect(
      client.hashData({
        profile: 'Default',
        input: undefined as unknown as Uint8Array,
        outputFormat: HashDataOutputFormat.HASH_OUTPUT_FORMAT_HEX,
      }),
    ).rejects.toThrow('input');
    await expect(
      client.hashData(undefined as unknown as HashDataPayload),
    ).rejects.toThrow(TypeError);
    await expect(
      client.hashData({
        profile: '',
        input: Buffer.from('Hello world'),
        outputFormat: HashDataOutputFormat.HASH_OUTPUT_FORMAT_HEX,
      }),
    ).rejects.toThrow('profile');
    await expect(
      client.hashData({
        profile: 'Default',
        input: 'Hello world' as unknown as Uint8Array,
        outputFormat: HashDataOutputFormat.HASH_OUTPUT_FORMAT_HEX,
      }),
    ).rejects.toThrow('input');
    await expect(
      client.hashData({
        profile: 'Default',
        input: Buffer.from('Hello world'),
        metadata: {
          id: 'mocked-id',
          traceContext: {
            traceId: '0'.repeat(33),
            spanId: '',
            traceFlags: '',
            traceState: '',
            correlationId: '',
          },
        },
        outputFormat: HashDataOutputFormat.HASH_OUTPUT_FORMAT_HEX,
      }),
    ).rejects.toThrow('metadata.traceContext.traceId');
    expect(client['client'].HashData).not.toHaveBeenCalled();
  });

  it('hash data should autofill the metadata values', async () => {
    const payload: HashDataRequest = {
      profile: 'Default',
      input: Buffer.from('Hello world'),
      metadata: undefined,
      outputFormat: HashDataOutputFormat.HASH_OUTPUT_FORMAT_HEX,
    };
    const response: HashDataResponse = await client.hashData(payload);

    // Test that the response is a subset of the object
    expect(response).toMatchObject({
      hashValueHex:
        'e2e1c9e522efb2495a178434c8bb8f11000ca23f1fd679058b7d7e141f0cf3433f94fc427ec0b9bebb12f327a3240021053db6091196576d5e6d9bd8fac71c0c',
      descriptor: {
        profile: 'Default',
        operation: 'HashData',
        algorithm: 'sha3-512',
      },
    });

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
    expect(client['client'].HashData).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: { id: response.metadata?.id } }),
    );
  });
});
