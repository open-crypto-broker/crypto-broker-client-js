import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CertEncoding, CryptoBrokerClient } from './client.js';
import { validate } from 'uuid';
import {
  HashRequest,
  HashResponse,
  SignRequest,
  SignResponse,
} from './proto/messages.js';

// Mock the protobuf client under the hood, returning the same values after doing a gRPC call functions
jest.mock('./proto/messages.js', () => ({
  CryptoGrpcClientImpl: jest.fn().mockImplementation(() => ({
    Hash: jest
      .fn<(input: HashRequest) => Promise<HashResponse>>()
      .mockImplementation(async (input) => ({
        hashValue:
          '217a621302950213819fcb88a904b3e59735de83d366112dd4b817103b097d334a3a283a0fbc20aaf5b9fafc2f3d1d685e1ea812c7686840d389a99c9dfb168f',
        hashAlgorithm: 'sha3-512',
        metadata: {
          id: input.metadata?.id || 'empty',
          createdAt: input.metadata?.createdAt || 'empty',
        },
      })),
    Sign: jest
      .fn<(input: SignRequest) => Promise<SignResponse>>()
      .mockImplementation(async (input) => ({
        signedCertificate:
          'MIICZzCCAe6gAwIBAgIUIxZKFE64ZO/jNqFK1TAMnI1kOcYwCgYIKoZIzj0EAwQwgYYxCzAJBgNVBAYTAkRFMRAwDgYDVQQIDAdCYXZhcmlhMRowGAYDVQQKDBFUZXN0LU9yZ2FuaXphdGlvbjEdMBsGA1UECwwUVGVzdC1Pcmdhbml6YXRpb24tQ0ExKjAoBgNVBAMMIVRlc3QtT3JnYW5pemF0aW9uLUludGVybWVkaWF0ZS1DQTAeFw0yNTA3MjQwOTAxNTNaFw0yNjA3MjQxMDAxNTNaMEwxCzAJBgNVBAYTAkRFMQswCQYDVQQIEwJCQTEMMAoGA1UEChMDU0FQMQ8wDQYDVQQDEwZNeUNlcnQxETAPBgNVBAUTCDAxMjM0NTU2MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEgLWqYJmgsXLUJLta6oIOykuzGNz76VMZj+wcfb9+MZA5A/WSfPVk9/JigQOfF49JcOI1Wb+gIfq1TNAkK/xOMTjfpxXeYglrFW/e278Q3TbYvhEHI3kOgIUJDbhSvRn/o1YwVDAOBgNVHQ8BAf8EBAMCBaAwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBT3KuJBMgQEcYrmI1TyGOb0P2/P3zAKBggqhkjOPQQDBANnADBkAjAkfToWryrE01PNlWEad7iBIwHvm5MvXZOeQV6rLbWD0XhVGaSDDbzLspHZhWaTDr0CMFaUxu1EcUZg4IA9bHw0i3z+r7/CHPIifhZVJgN4PBB8UavfKVVzpSAXTN6k4EeDEA==',
        metadata: {
          id: input.metadata?.id || 'empty',
          createdAt: input.metadata?.createdAt || 'empty',
        },
      })),
  })),
}));

describe('CryptoBrokerClient', () => {
  let client: CryptoBrokerClient;

  beforeEach(() => {
    client = new CryptoBrokerClient();
  });

  it('should use the clients specified unix socket', async () => {
    expect(client['address']).toBe('unix:/tmp/cryptobroker.sock');
  });

  it('should return mocked hash response', async () => {
    const payload = {
      profile: 'Default',
      input: Buffer.from('Testing Data'),
      metadata: { id: 'mocked-id', createdAt: 'mocked-date' },
    };
    const response: HashResponse = await client.hashData(payload);

    // Test that the response matches what is expected
    expect(response).toEqual({
      hashValue:
        '217a621302950213819fcb88a904b3e59735de83d366112dd4b817103b097d334a3a283a0fbc20aaf5b9fafc2f3d1d685e1ea812c7686840d389a99c9dfb168f',
      hashAlgorithm: 'sha3-512',
      metadata: { id: 'mocked-id', createdAt: 'mocked-date' },
    });
  });

  it('hash should autofill the metadata values', async () => {
    const payload = {
      profile: 'Default',
      input: Buffer.from('Testing Data'),
    };
    const response: HashResponse = await client.hashData(payload);

    // Test that the response is a subset of the object
    expect(response).toMatchObject({
      hashValue:
        '217a621302950213819fcb88a904b3e59735de83d366112dd4b817103b097d334a3a283a0fbc20aaf5b9fafc2f3d1d685e1ea812c7686840d389a99c9dfb168f',
      hashAlgorithm: 'sha3-512',
    });

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(validate(response.metadata?.id)).toBeTruthy();
    expect(response.metadata?.createdAt).not.toEqual('empty');
    expect(new Date(response.metadata?.createdAt || '')).not.toEqual(
      'Invalid Date',
    );
  });

  it('should return mocked sign response', async () => {
    const payload = {
      profile: 'Default',
      csr: 'mocked-csr',
      caPrivateKey: 'mocked-key',
      caCert: 'mocked-cert',
      metadata: { id: 'mocked-id', createdAt: 'mocked-date' },
      validNotBeforeOffset: '0',
      validNotAfterOffset: '1',
      subject: 'CN=Test',
      crlDistributionPoint: ['http://example.com/crl'],
    };
    const options = {
      encoding: CertEncoding.B64,
    };
    const response: SignResponse = await client.signCertificate(
      payload,
      options,
    );

    expect(response).toEqual({
      signedCertificate:
        'MIICZzCCAe6gAwIBAgIUIxZKFE64ZO/jNqFK1TAMnI1kOcYwCgYIKoZIzj0EAwQwgYYxCzAJBgNVBAYTAkRFMRAwDgYDVQQIDAdCYXZhcmlhMRowGAYDVQQKDBFUZXN0LU9yZ2FuaXphdGlvbjEdMBsGA1UECwwUVGVzdC1Pcmdhbml6YXRpb24tQ0ExKjAoBgNVBAMMIVRlc3QtT3JnYW5pemF0aW9uLUludGVybWVkaWF0ZS1DQTAeFw0yNTA3MjQwOTAxNTNaFw0yNjA3MjQxMDAxNTNaMEwxCzAJBgNVBAYTAkRFMQswCQYDVQQIEwJCQTEMMAoGA1UEChMDU0FQMQ8wDQYDVQQDEwZNeUNlcnQxETAPBgNVBAUTCDAxMjM0NTU2MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEgLWqYJmgsXLUJLta6oIOykuzGNz76VMZj+wcfb9+MZA5A/WSfPVk9/JigQOfF49JcOI1Wb+gIfq1TNAkK/xOMTjfpxXeYglrFW/e278Q3TbYvhEHI3kOgIUJDbhSvRn/o1YwVDAOBgNVHQ8BAf8EBAMCBaAwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBT3KuJBMgQEcYrmI1TyGOb0P2/P3zAKBggqhkjOPQQDBANnADBkAjAkfToWryrE01PNlWEad7iBIwHvm5MvXZOeQV6rLbWD0XhVGaSDDbzLspHZhWaTDr0CMFaUxu1EcUZg4IA9bHw0i3z+r7/CHPIifhZVJgN4PBB8UavfKVVzpSAXTN6k4EeDEA==',
      metadata: { id: 'mocked-id', createdAt: 'mocked-date' },
    });
  });

  it('sign should autofill the metadata', async () => {
    const payload = {
      profile: 'Default',
      csr: 'mocked-csr',
      caPrivateKey: 'mocked-key',
      caCert: 'mocked-cert',
      validNotBeforeOffset: '0',
      validNotAfterOffset: '1',
      subject: 'CN=Test',
      crlDistributionPoint: ['http://example.com/crl'],
    };
    const options = {
      encoding: CertEncoding.B64,
    };
    const response: SignResponse = await client.signCertificate(
      payload,
      options,
    );

    // Test that the response is a subset of the object
    expect(response).toMatchObject({
      signedCertificate:
        'MIICZzCCAe6gAwIBAgIUIxZKFE64ZO/jNqFK1TAMnI1kOcYwCgYIKoZIzj0EAwQwgYYxCzAJBgNVBAYTAkRFMRAwDgYDVQQIDAdCYXZhcmlhMRowGAYDVQQKDBFUZXN0LU9yZ2FuaXphdGlvbjEdMBsGA1UECwwUVGVzdC1Pcmdhbml6YXRpb24tQ0ExKjAoBgNVBAMMIVRlc3QtT3JnYW5pemF0aW9uLUludGVybWVkaWF0ZS1DQTAeFw0yNTA3MjQwOTAxNTNaFw0yNjA3MjQxMDAxNTNaMEwxCzAJBgNVBAYTAkRFMQswCQYDVQQIEwJCQTEMMAoGA1UEChMDU0FQMQ8wDQYDVQQDEwZNeUNlcnQxETAPBgNVBAUTCDAxMjM0NTU2MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEgLWqYJmgsXLUJLta6oIOykuzGNz76VMZj+wcfb9+MZA5A/WSfPVk9/JigQOfF49JcOI1Wb+gIfq1TNAkK/xOMTjfpxXeYglrFW/e278Q3TbYvhEHI3kOgIUJDbhSvRn/o1YwVDAOBgNVHQ8BAf8EBAMCBaAwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBT3KuJBMgQEcYrmI1TyGOb0P2/P3zAKBggqhkjOPQQDBANnADBkAjAkfToWryrE01PNlWEad7iBIwHvm5MvXZOeQV6rLbWD0XhVGaSDDbzLspHZhWaTDr0CMFaUxu1EcUZg4IA9bHw0i3z+r7/CHPIifhZVJgN4PBB8UavfKVVzpSAXTN6k4EeDEA==',
    });

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(validate(response.metadata?.id)).toBeTruthy();
    expect(response.metadata?.createdAt).not.toEqual('empty');
    expect(new Date(response.metadata?.createdAt || '')).not.toEqual(
      'Invalid Date',
    );
  });

  it('should return mocked sign response (PEM-encoded)', async () => {
    const payload = {
      profile: 'Default',
      csr: 'mocked-csr',
      caPrivateKey: 'mocked-key',
      caCert: 'mocked-cert',
      validNotBeforeOffset: '0',
      validNotAfterOffset: '1',
      subject: 'CN=Test',
      crlDistributionPoint: ['http://example.com/crl'],
    };
    const response: SignResponse = await client.signCertificate(payload);

    // Test that the response is a subset of the object
    expect(response).toMatchObject({
      signedCertificate:
        '-----BEGIN CERTIFICATE-----\n' +
        'MIICZzCCAe6gAwIBAgIUIxZKFE64ZO/jNqFK1TAMnI1kOcYwCgYIKoZIzj0EAwQw\n' +
        'gYYxCzAJBgNVBAYTAkRFMRAwDgYDVQQIDAdCYXZhcmlhMRowGAYDVQQKDBFUZXN0\n' +
        'LU9yZ2FuaXphdGlvbjEdMBsGA1UECwwUVGVzdC1Pcmdhbml6YXRpb24tQ0ExKjAo\n' +
        'BgNVBAMMIVRlc3QtT3JnYW5pemF0aW9uLUludGVybWVkaWF0ZS1DQTAeFw0yNTA3\n' +
        'MjQwOTAxNTNaFw0yNjA3MjQxMDAxNTNaMEwxCzAJBgNVBAYTAkRFMQswCQYDVQQI\n' +
        'EwJCQTEMMAoGA1UEChMDU0FQMQ8wDQYDVQQDEwZNeUNlcnQxETAPBgNVBAUTCDAx\n' +
        'MjM0NTU2MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEgLWqYJmgsXLUJLta6oIOykuz\n' +
        'GNz76VMZj+wcfb9+MZA5A/WSfPVk9/JigQOfF49JcOI1Wb+gIfq1TNAkK/xOMTjf\n' +
        'pxXeYglrFW/e278Q3TbYvhEHI3kOgIUJDbhSvRn/o1YwVDAOBgNVHQ8BAf8EBAMC\n' +
        'BaAwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAW\n' +
        'gBT3KuJBMgQEcYrmI1TyGOb0P2/P3zAKBggqhkjOPQQDBANnADBkAjAkfToWryrE\n' +
        '01PNlWEad7iBIwHvm5MvXZOeQV6rLbWD0XhVGaSDDbzLspHZhWaTDr0CMFaUxu1E\n' +
        'cUZg4IA9bHw0i3z+r7/CHPIifhZVJgN4PBB8UavfKVVzpSAXTN6k4EeDEA==\n' +
        '-----END CERTIFICATE-----',
    });

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(validate(response.metadata?.id)).toBeTruthy();
    expect(response.metadata?.createdAt).not.toEqual('empty');
    expect(new Date(response.metadata?.createdAt || '')).not.toEqual(
      'Invalid Date',
    );
  });
});
