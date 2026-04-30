import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CertEncoding, CryptoBrokerClient } from './client.js';
import {
  BenchmarkRequest,
  BenchmarkResponse,
  HashRequest,
  HashResponse,
  SignRequest,
  SignResponse,
} from './proto/messages.js';
import {
  HealthCheckRequest,
  HealthCheckResponse,
} from './proto/third_party/grpc/health/v1/health.js';
import * as grpc from '@grpc/grpc-js';

const isUUID4 = (val: string | undefined) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof val === 'string' && regex.test(val);
};

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
    Benchmark: jest
      .fn<(input: BenchmarkRequest) => Promise<BenchmarkResponse>>()
      .mockImplementation(async (input) => ({
        benchmarkResults: JSON.stringify({
          results: [
            {
              name: 'some_mocked_algorithm_test_name',
              avgTime: 42,
            },
          ],
        }),
        metadata: {
          id: input.metadata?.id || 'empty',
          createdAt: input.metadata?.createdAt || 'empty',
        },
      })),
  })),
}));
jest.mock('./proto/third_party/grpc/health/v1/health.js', () => ({
  HealthClientImpl: jest.fn().mockImplementation(() => ({
    Check: jest
      .fn<(input: HealthCheckRequest) => Promise<HealthCheckResponse>>()
      .mockImplementationOnce(async () => ({
        status: 1, // on the first call we're serving
      }))
      .mockImplementationOnce(async () => {
        throw new Error('mocked failure');
      }),
  })),
}));

describe('CryptoBrokerClient', () => {
  let client: CryptoBrokerClient;

  beforeEach(() => {
    client = new CryptoBrokerClient();
  });

  it('should use a retry mechanism with NewLibrary', async () => {
    jest.useFakeTimers();

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const waitForReadyMock = jest
      .spyOn(grpc.Client.prototype, 'waitForReady')
      .mockImplementationOnce((_d, cb) => cb(new Error('mocked failure')))
      .mockImplementationOnce((_d, cb) => cb())
      .mockImplementation((_d, cb) => cb(new Error('mocked failure')));

    // at first the connection fails, a retry is run, then the connection and channel readiness succeed
    const retryInstance = await CryptoBrokerClient.NewLibrary();
    expect(waitForReadyMock).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(retryInstance).toBeInstanceOf(CryptoBrokerClient);

    // when the retry limit is reached, NewLibrary will throw an error
    waitForReadyMock.mockClear();
    consoleErrorSpy.mockClear();
    await expect(CryptoBrokerClient.NewLibrary()).rejects.toThrow(
      'retry limit reached',
    );
    expect(waitForReadyMock).toHaveBeenCalledTimes(60);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(60);
  });

  it('should use the clients specified Unix socket', async () => {
    expect(client['address']).toBe(
      'unix:/tmp/open-crypto-broker/crypto-broker-server.sock',
    );
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
    const payload: HashRequest = {
      profile: 'Default',
      input: Buffer.from('Testing Data'),
      metadata: undefined,
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
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
    expect(response.metadata?.createdAt).not.toEqual('empty');
    expect(new Date(response.metadata?.createdAt || '')).not.toEqual(
      'Invalid Date',
    );
  });

  it('should return mocked sign response', async () => {
    const payload: SignRequest = {
      profile: 'Default',
      csr: 'mocked-csr',
      caPrivateKey: 'mocked-key',
      caCert: 'mocked-cert',
      metadata: { id: 'mocked-id', createdAt: 'mocked-date' },
      subject: 'CN=Test',
      crlDistributionPoints: ['http://example.com/crl'],
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
      crlDistributionPoints: ['http://example.com/crl'],
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
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
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
      crlDistributionPoints: ['http://example.com/crl'],
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
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
    expect(response.metadata?.createdAt).not.toEqual('empty');
    expect(new Date(response.metadata?.createdAt || '')).not.toEqual(
      'Invalid Date',
    );
  });

  it('should return the mocked health response', async () => {
    const servingResponse: HealthCheckResponse = await client.healthData();

    // Test that the response shows the serving status with SERVING
    expect(servingResponse.status).toBeDefined();
    expect(servingResponse.status).toEqual(1);

    const unknownResponse: HealthCheckResponse = await client.healthData();

    // Test that the response shows the serving status with UNKNOWN
    expect(unknownResponse.status).toBeDefined();
    expect(unknownResponse.status).toEqual(0);
  });

  it('benchmark should autofill the metadata', async () => {
    const response: BenchmarkResponse = await client.benchmarkData({});

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
    expect(response.metadata?.createdAt).not.toEqual('empty');
    expect(new Date(response.metadata?.createdAt || '')).not.toEqual(
      'Invalid Date',
    );
  });

  it('should return the mocked benchmark data response', async () => {
    const response: BenchmarkResponse = await client.benchmarkData({});

    // Test that the response is valid and has json-parsable results
    expect(response.benchmarkResults).toBeDefined();
    expect(JSON.parse(response.benchmarkResults)).toHaveProperty('results');
  });
});
