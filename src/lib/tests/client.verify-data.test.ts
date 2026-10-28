import { describe, expect, it } from '@jest/globals';
import {
  CryptoBrokerClient,
  VerifyDataPayload,
  SignatureFormat,
} from '../client.js';
import { isUUID4 } from './client.test-utils.js';

describe('CryptoBrokerClient', () => {
  const client: CryptoBrokerClient = new CryptoBrokerClient({
    circuitBreakerOptions: {
      enabled: false,
    },
  });
  it('should return that the signature is valid', async () => {
    const payload: VerifyDataPayload = {
      profile: 'Default',
      keySource: {
        single: {
          keyId: 'mocked-keyID',
        },
      },
      input: Buffer.from('Welcome CryptoBroker'),
      signatureFormat: SignatureFormat.SIGNATURE_FORMAT_RAW,
      signature: Buffer.from('deadbeef', 'hex'),
      metadata: { id: 'mocked-id' },
    };
    const response = await client.verifyData(payload);

    // Test that the response matches what is expected
    expect(response).toEqual({
      valid: true,
      metadata: { id: 'mocked-id' },
    });
  });
  it('should reject invalid verify data payloads before making a request', async () => {
    await expect(
      client.verifyData(undefined as unknown as VerifyDataPayload),
    ).rejects.toThrow(TypeError);
    await expect(
      client.verifyData({
        profile: '',
        keySource: {
          single: {
            keyId: 'mocked-keyID',
          },
        },
        input: Buffer.from('Welcome CryptoBroker'),
        signatureFormat: SignatureFormat.SIGNATURE_FORMAT_RAW,
        signature: Buffer.from('deadbeef', 'hex'),
        metadata: { id: 'mocked-id' },
      }),
    ).rejects.toThrow('profile');
    await expect(
      client.verifyData({
        profile: 'Default',
        keySource: {
          single: {
            keyId: 'mocked-keyID',
          },
        },
        input: 'Welcome CryptoBroker' as unknown as Uint8Array,
        signatureFormat: SignatureFormat.SIGNATURE_FORMAT_RAW,
        signature: Buffer.from(''),
        metadata: { id: 'mocked-id' },
      }),
    ).rejects.toThrow('input');
    await expect(
      client.verifyData({
        profile: 'Default',
        keySource: {
          single: {
            keyId: 'mocked-keyID',
          },
        },
        input: Buffer.from('Welcome CryptoBroker'),
        signatureFormat: SignatureFormat.SIGNATURE_FORMAT_RAW,
        signature: Buffer.from('deadbeef', 'hex'),
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
      }),
    ).rejects.toThrow('metadata.traceContext.traceId');
    await expect(
      client.verifyData({
        profile: 'Default',
        keySource: {},
        input: Buffer.from('Welcome CryptoBroker'),
        signatureFormat: SignatureFormat.SIGNATURE_FORMAT_RAW,
        signature: Buffer.from('deadbeef', 'hex'),
        metadata: { id: 'mocked-id' },
      }),
    ).rejects.toThrow('keySource');
    await expect(
      client.verifyData({
        profile: 'Default',
        keySource: {
          single: {
            keyId: 'mocked-keyID',
          },
          componentKeys: {
            keys: [
              {
                keyId: 'mocked-keyID',
              },
              {
                rawKey: Buffer.from('mocked-rawKey'),
              },
            ],
          },
        },
        input: Buffer.from('Welcome CryptoBroker'),
        signatureFormat: SignatureFormat.SIGNATURE_FORMAT_RAW,
        signature: Buffer.from('deadbeef', 'hex'),
        metadata: { id: 'mocked-id' },
      }),
    ).rejects.toThrow('keySource');
    await expect(
      client.verifyData({
        profile: 'Default',
        keySource: {
          single: {
            keyId: 'mocked-keyID',
          },
        },
        input: Buffer.from('Welcome CryptoBroker'),
        signature: Buffer.from('deadbeef', 'hex'),
        signatureFormat: -1,
        metadata: { id: 'mocked-id' },
      }),
    ).rejects.toThrow('signatureFormat');
  });

  it('verify data should autofill the metadata values', async () => {
    const payload: VerifyDataPayload = {
      profile: 'Default',
      keySource: {
        single: {
          keyId: 'mocked-keyID',
        },
      },
      input: Buffer.from('Welcome CryptoBroker'),
      signatureFormat: SignatureFormat.SIGNATURE_FORMAT_RAW,
      signature: Buffer.from('deadbeef', 'hex'),
      metadata: undefined,
    };
    const response = await client.verifyData(payload);

    // Test that the response is a subset of the object
    expect(response).toMatchObject({
      valid: true,
    });

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
  });
});
