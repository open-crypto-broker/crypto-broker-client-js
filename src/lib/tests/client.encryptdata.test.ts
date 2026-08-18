import { describe, expect, it } from '@jest/globals';
import {
  CryptoBrokerClient,
  EncryptDataPayload,
  DecryptDataPayload,
} from '../client.js';
import { isUUID4 } from './client.test-utils.js';

describe('CryptoBrokerClient', () => {
  const client: CryptoBrokerClient = new CryptoBrokerClient({
    circuitBreakerOptions: {
      enabled: false,
    },
  });

  it('should return a mocked encrypted data response', async () => {
    const payload: EncryptDataPayload = {
      profile: 'Default',
      keySource: {
        keyId: 'mocked-keyID',
      },
      plaintext: Buffer.from('Welcome CryptoBroker'),
      encryptMetadata: {
        nonce: Buffer.from('mocked-nonce'),
        aad: Buffer.from('mocked-aad'),
      },
      metadata: { id: 'mocked-id' },
    };
    const response = await client.encryptData(payload);

    // Test that the response matches what is expected
    expect(response).toEqual({
      ciphertext: Buffer.from(
        '71416b876fb0d65c484ec20106af15a36454743b',
        'hex',
      ),
      cipherMetadata: {
        nonce: Buffer.from('a83f89b37c90f937b8df5011', 'hex'),
        aad: Buffer.from('36e02c2a81c60eca849739d52dea95f7', 'hex'),
        tag: Buffer.from('a77b42e960d89683140cae283a87466e', 'hex'),
      },
      metadata: { id: 'mocked-id' },
    });
  });
  it('should reject invalid encrypt data payloads before making a request', async () => {
    await expect(
      client.encryptData(undefined as unknown as EncryptDataPayload),
    ).rejects.toThrow(TypeError);
    await expect(
      client.encryptData({
        profile: '',
        keySource: {
          keyId: 'mocked-keyID',
        },
        plaintext: Buffer.from('Welcome CryptoBroker'),
        encryptMetadata: {
          nonce: Buffer.from('mocked-nonce'),
          aad: Buffer.from('mocked-aad'),
        },
        metadata: { id: 'mocked-id' },
      }),
    ).rejects.toThrow('profile');
    await expect(
      client.encryptData({
        profile: 'Default',
        keySource: {
          keyId: 'mocked-keyID',
        },
        plaintext: 'Welcome CryptoBroker' as unknown as Uint8Array,
        encryptMetadata: {
          nonce: Buffer.from('mocked-nonce'),
          aad: Buffer.from('mocked-aad'),
        },
        metadata: { id: 'mocked-id' },
      }),
    ).rejects.toThrow('plaintext');
    await expect(
      client.encryptData({
        profile: 'Default',
        keySource: {
          keyId: 'mocked-keyID',
        },
        plaintext: Buffer.from('Welcome CryptoBroker'),
        encryptMetadata: {
          nonce: Buffer.from('mocked-nonce'),
          aad: Buffer.from('mocked-aad'),
        },
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
      client.encryptData({
        profile: 'Default',
        keySource: {},
        plaintext: Buffer.from('Welcome CryptoBroker'),
        encryptMetadata: {
          nonce: Buffer.from('mocked-nonce'),
          aad: Buffer.from('mocked-aad'),
        },
        metadata: { id: 'mocked-id' },
      }),
    ).rejects.toThrow('keySource');
  });

  it('encrypt data should autofill the metadata values', async () => {
    const payload: EncryptDataPayload = {
      profile: 'Default',
      keySource: {
        keyId: 'mocked-keyID',
      },
      plaintext: Buffer.from('Welcome CryptoBroker'),
      encryptMetadata: {
        nonce: Buffer.from('mocked-nonce'),
        aad: Buffer.from('mocked-aad'),
      },
      metadata: undefined,
    };
    const response = await client.encryptData(payload);

    // Test that the response is a subset of the object
    expect(response).toMatchObject({
      ciphertext: Buffer.from(
        '71416b876fb0d65c484ec20106af15a36454743b',
        'hex',
      ),
      cipherMetadata: {
        nonce: Buffer.from('a83f89b37c90f937b8df5011', 'hex'),
        aad: Buffer.from('36e02c2a81c60eca849739d52dea95f7', 'hex'),
        tag: Buffer.from('a77b42e960d89683140cae283a87466e', 'hex'),
      },
    });

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
  });

  it('should return a mocked decrypted data response', async () => {
    const payload: DecryptDataPayload = {
      profile: 'Default',
      keySource: {
        keyId: 'mocked-keyID',
      },
      ciphertext: Buffer.from(
        '71416b876fb0d65c484ec20106af15a36454743b',
        'hex',
      ),
      decryptMetadata: {
        nonce: Buffer.from('a83f89b37c90f937b8df5011', 'hex'),
        aad: Buffer.from('36e02c2a81c60eca849739d52dea95f7', 'hex'),
        tag: Buffer.from('a77b42e960d89683140cae283a87466e', 'hex'),
      },
      metadata: { id: 'mocked-id' },
    };
    const response = await client.decryptData(payload);

    // Test that the response matches what is expected
    expect(response).toEqual({
      plaintext: Buffer.from('Welcome CryptoBroker'),
      metadata: { id: 'mocked-id' },
    });
  });
  it('should reject invalid decrypt data payloads before making a request', async () => {
    await expect(
      client.decryptData(undefined as unknown as DecryptDataPayload),
    ).rejects.toThrow(TypeError);
    await expect(
      client.decryptData({
        profile: '',
        keySource: {
          keyId: 'mocked-keyID',
        },
        ciphertext: Buffer.from(
          '71416b876fb0d65c484ec20106af15a36454743b',
          'hex',
        ),
        decryptMetadata: {
          nonce: Buffer.from('a83f89b37c90f937b8df5011', 'hex'),
          aad: Buffer.from('36e02c2a81c60eca849739d52dea95f7', 'hex'),
          tag: Buffer.from('a77b42e960d89683140cae283a87466e', 'hex'),
        },
        metadata: { id: 'mocked-id' },
      }),
    ).rejects.toThrow('profile');
    await expect(
      client.decryptData({
        profile: 'Default',
        keySource: {
          keyId: 'mocked-keyID',
        },
        ciphertext: 'mocked-ciphertext' as unknown as Uint8Array,
        decryptMetadata: {
          nonce: Buffer.from('a83f89b37c90f937b8df5011', 'hex'),
          aad: Buffer.from('36e02c2a81c60eca849739d52dea95f7', 'hex'),
          tag: Buffer.from('a77b42e960d89683140cae283a87466e', 'hex'),
        },
        metadata: { id: 'mocked-id' },
      }),
    ).rejects.toThrow('ciphertext');
    await expect(
      client.decryptData({
        profile: 'Default',
        keySource: {
          keyId: 'mocked-keyID',
        },
        ciphertext: Buffer.from(
          '71416b876fb0d65c484ec20106af15a36454743b',
          'hex',
        ),
        decryptMetadata: {
          nonce: Buffer.from('a83f89b37c90f937b8df5011', 'hex'),
          aad: Buffer.from('36e02c2a81c60eca849739d52dea95f7', 'hex'),
          tag: Buffer.from('a77b42e960d89683140cae283a87466e', 'hex'),
        },
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
      client.decryptData({
        profile: 'Default',
        keySource: {},
        ciphertext: Buffer.from(
          '71416b876fb0d65c484ec20106af15a36454743b',
          'hex',
        ),
        decryptMetadata: {
          nonce: Buffer.from('a83f89b37c90f937b8df5011', 'hex'),
          aad: Buffer.from('36e02c2a81c60eca849739d52dea95f7', 'hex'),
          tag: Buffer.from('a77b42e960d89683140cae283a87466e', 'hex'),
        },
        metadata: { id: 'mocked-id' },
      }),
    ).rejects.toThrow('keySource');
    await expect(
      client.decryptData({
        profile: 'Default',
        keySource: {
          keyId: 'mocked-keyID',
          rawKey: Buffer.from('mocked-rawKey'),
        },
        ciphertext: Buffer.from(
          '71416b876fb0d65c484ec20106af15a36454743b',
          'hex',
        ),
        decryptMetadata: {
          nonce: Buffer.from('a83f89b37c90f937b8df5011', 'hex'),
          aad: Buffer.from('36e02c2a81c60eca849739d52dea95f7', 'hex'),
          tag: Buffer.from('a77b42e960d89683140cae283a87466e', 'hex'),
        },
        metadata: { id: 'mocked-id' },
      }),
    ).rejects.toThrow('keySource');
  });

  it('decrypt data should autofill the metadata values', async () => {
    const payload: DecryptDataPayload = {
      profile: 'Default',
      keySource: {
        keyId: 'mocked-keyID',
      },
      ciphertext: Buffer.from(
        '71416b876fb0d65c484ec20106af15a36454743b',
        'hex',
      ),
      decryptMetadata: {
        nonce: Buffer.from('a83f89b37c90f937b8df5011', 'hex'),
        aad: Buffer.from('36e02c2a81c60eca849739d52dea95f7', 'hex'),
        tag: Buffer.from('a77b42e960d89683140cae283a87466e', 'hex'),
      },
      metadata: undefined,
    };
    const response = await client.decryptData(payload);

    // Test that the response is a subset of the object
    expect(response).toMatchObject({
      plaintext: Buffer.from('Welcome CryptoBroker'),
    });

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
  });
});
