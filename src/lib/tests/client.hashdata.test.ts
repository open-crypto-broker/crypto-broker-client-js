import { describe, expect, it } from '@jest/globals';
import {
  CryptoBrokerClient,
  HashDataOutputFormat,
  HashDataPayload,
} from '../client.js';
import { HashDataRequest, HashDataResponse } from '../proto/messages.js';
import { isUUID4 } from './client.test-utils.js';

describe('CryptoBrokerClient', () => {
  const client: CryptoBrokerClient = new CryptoBrokerClient({
    circuitBreakerOptions: {
      enabled: false,
    },
  });

  it('should return a mocked hash data response', async () => {
    const payload = {
      profile: 'Default',
      input: Buffer.from('Testing Data'),
      metadata: { id: 'mocked-id' },
      outputFormat: HashDataOutputFormat.HEX,
    };
    const response: HashDataResponse = await client.hashData(payload);

    // Test that the response matches what is expected
    expect(response).toEqual({
      hashValueHex:
        '217a621302950213819fcb88a904b3e59735de83d366112dd4b817103b097d334a3a283a0fbc20aaf5b9fafc2f3d1d685e1ea812c7686840d389a99c9dfb168f',
      hashAlgorithm: 'sha3-512',
      metadata: { id: 'mocked-id' },
    });
  });
  it('should reject invalid hash data payloads before making a request', async () => {
    await expect(
      client.hashData(undefined as unknown as HashDataPayload),
    ).rejects.toThrow(TypeError);
    await expect(
      client.hashData({
        profile: '',
        input: Buffer.from('Testing Data'),
        outputFormat: HashDataOutputFormat.HEX,
      }),
    ).rejects.toThrow('profile');
    await expect(
      client.hashData({
        profile: 'Default',
        input: 'Testing Data' as unknown as Uint8Array,
        outputFormat: HashDataOutputFormat.HEX,
      }),
    ).rejects.toThrow('input');
    await expect(
      client.hashData({
        profile: 'Default',
        input: Buffer.from('Testing Data'),
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
        outputFormat: HashDataOutputFormat.HEX,
      }),
    ).rejects.toThrow('metadata.traceContext.traceId');
  });

  it('hash data should autofill the metadata values', async () => {
    const payload: HashDataRequest = {
      profile: 'Default',
      input: Buffer.from('Testing Data'),
      metadata: undefined,
      outputFormat: HashDataOutputFormat.HEX,
    };
    const response: HashDataResponse = await client.hashData(payload);

    // Test that the response is a subset of the object
    expect(response).toMatchObject({
      hashValueHex:
        '217a621302950213819fcb88a904b3e59735de83d366112dd4b817103b097d334a3a283a0fbc20aaf5b9fafc2f3d1d685e1ea812c7686840d389a99c9dfb168f',
      hashAlgorithm: 'sha3-512',
    });

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
  });
});
