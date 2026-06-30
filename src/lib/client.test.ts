import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CryptoBrokerClient } from './client.js';
import {
  BenchmarkRequest,
  BenchmarkResponse,
  CryptoGrpcClientImpl,
  HashDataRequest,
  HashDataResponse,
  SignCertificateRequest,
  SignCertificateResponse,
} from './proto/messages.js';
import {
  HealthCheckRequest,
  HealthCheckResponse,
} from './proto/third_party/grpc/health/v1/health.js';
import * as grpc from '@grpc/grpc-js';

enum HashOutputFormat {
  HEX = 0,
  RAW = 1,
  UNRECOGNIZED = -1,
}
enum SignOutputFormat {
  DER = 0,
  PEM = 1,
  UNRECOGNIZED = -1,
}

const isUUID4 = (val: string | undefined) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof val === 'string' && regex.test(val);
};

// Mock the protobuf client under the hood, returning the same values after doing a gRPC call functions
jest.mock('./proto/messages.js', () => ({
  CryptoGrpcClientImpl: jest.fn().mockImplementation(() => ({
    HashData: jest
      .fn<(input: HashDataRequest) => Promise<HashDataResponse>>()
      .mockImplementation(async (input) => {
        const base = {
          hashAlgorithm: 'sha3-512',
          metadata: {
            id: input.metadata?.id || 'empty',
          },
        };
        if (input.outputFormat === HashOutputFormat.HEX) {
          return {
            ...base,
            hashValueHex:
              '217a621302950213819fcb88a904b3e59735de83d366112dd4b817103b097d334a3a283a0fbc20aaf5b9fafc2f3d1d685e1ea812c7686840d389a99c9dfb168f',
          };
        }
        return {
          ...base,
          hashValueRaw: new Uint8Array([0x63, 0x72, 0x79, 0x70, 0x74, 0x6f]),
        };
      }),
    SignCertificate: jest
      .fn<(input: SignCertificateRequest) => Promise<SignCertificateResponse>>()
      .mockImplementation(async (input) => {
        const base = {
          metadata: {
            id: input.metadata?.id || 'empty',
          },
        };
        if (input.outputFormat === SignOutputFormat.PEM) {
          return {
            ...base,
            pem: `-----BEGIN CERTIFICATE-----
MIICZzCCAe6gAwIBAgIUIxZKFE64ZO/jNqFK1TAMnI1kOcYwCgYIKoZIzj0EAwQw
gYYxCzAJBgNVBAYTAkRFMRAwDgYDVQQIDAdCYXZhcmlhMRowGAYDVQQKDBFUZXN0
LU9yZ2FuaXphdGlvbjEdMBsGA1UECwwUVGVzdC1Pcmdhbml6YXRpb24tQ0ExKjAo
BgNVBAMMIVRlc3QtT3JnYW5pemF0aW9uLUludGVybWVkaWF0ZS1DQTAeFw0yNTA3
MjQwOTAxNTNaFw0yNjA3MjQxMDAxNTNaMEwxCzAJBgNVBAYTAkRFMQswCQYDVQQI
EwJCQTEMMAoGA1UEChMDU0FQMQ8wDQYDVQQDEwZNeUNlcnQxETAPBgNVBAUTCDAx
MjM0NTU2MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEgLWqYJmgsXLUJLta6oIOykuz
GNz76VMZj+wcfb9+MZA5A/WSfPVk9/JigQOfF49JcOI1Wb+gIfq1TNAkK/xOMTjf
pxXeYglrFW/e278Q3TbYvhEHI3kOgIUJDbhSvRn/o1YwVDAOBgNVHQ8BAf8EBAMC
BaAwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAW
gBT3KuJBMgQEcYrmI1TyGOb0P2/P3zAKBggqhkjOPQQDBANnADBkAjAkfToWryrE
01PNlWEad7iBIwHvm5MvXZOeQV6rLbWD0XhVGaSDDbzLspHZhWaTDr0CMFaUxu1E
cUZg4IA9bHw0i3z+r7/CHPIifhZVJgN4PBB8UavfKVVzpSAXTN6k4EeDEA==
-----END CERTIFICATE-----`,
          };
        }
        return {
          ...base,
          der: new Uint8Array([0x63, 0x72, 0x79, 0x70, 0x74, 0x6f]),
        };
      }),
  })),
  CryptoGrpcDevClientImpl: jest.fn().mockImplementation(() => ({
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
    client = new CryptoBrokerClient({
      circuitBreakerOptions: {
        enabled: false,
      },
    });
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
      metadata: { id: 'mocked-id' },
      outputFormat: HashOutputFormat.HEX,
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
  it('should reject invalid hash payloads before making a request', async () => {
    await expect(
      client.hashData(undefined as unknown as HashDataRequest),
    ).rejects.toThrow(TypeError);
    await expect(
      client.hashData({
        profile: '',
        input: Buffer.from('Testing Data'),
        outputFormat: HashOutputFormat.HEX,
      }),
    ).rejects.toThrow('profile');
    await expect(
      client.hashData({
        profile: 'Default',
        input: 'Testing Data' as unknown as Uint8Array,
        outputFormat: HashOutputFormat.HEX,
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
        outputFormat: HashOutputFormat.HEX,
      }),
    ).rejects.toThrow('metadata.traceContext.traceId');
  });

  it('hash should autofill the metadata values', async () => {
    const payload: HashDataRequest = {
      profile: 'Default',
      input: Buffer.from('Testing Data'),
      metadata: undefined,
      outputFormat: HashOutputFormat.HEX,
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

  it('should return mocked sign response', async () => {
    const payload: SignCertificateRequest = {
      profile: 'Default',
      csr: 'mocked-csr',
      caPrivateKey: 'mocked-key',
      caCert: 'mocked-cert',
      metadata: { id: 'mocked-id' },
      subject: 'CN=Test',
      crlDistributionPoints: ['http://example.com/crl'],
      outputFormat: SignOutputFormat.PEM,
    };
    const response: SignCertificateResponse =
      await client.signCertificate(payload);

    expect(response).toEqual({
      pem: `-----BEGIN CERTIFICATE-----
MIICZzCCAe6gAwIBAgIUIxZKFE64ZO/jNqFK1TAMnI1kOcYwCgYIKoZIzj0EAwQw
gYYxCzAJBgNVBAYTAkRFMRAwDgYDVQQIDAdCYXZhcmlhMRowGAYDVQQKDBFUZXN0
LU9yZ2FuaXphdGlvbjEdMBsGA1UECwwUVGVzdC1Pcmdhbml6YXRpb24tQ0ExKjAo
BgNVBAMMIVRlc3QtT3JnYW5pemF0aW9uLUludGVybWVkaWF0ZS1DQTAeFw0yNTA3
MjQwOTAxNTNaFw0yNjA3MjQxMDAxNTNaMEwxCzAJBgNVBAYTAkRFMQswCQYDVQQI
EwJCQTEMMAoGA1UEChMDU0FQMQ8wDQYDVQQDEwZNeUNlcnQxETAPBgNVBAUTCDAx
MjM0NTU2MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEgLWqYJmgsXLUJLta6oIOykuz
GNz76VMZj+wcfb9+MZA5A/WSfPVk9/JigQOfF49JcOI1Wb+gIfq1TNAkK/xOMTjf
pxXeYglrFW/e278Q3TbYvhEHI3kOgIUJDbhSvRn/o1YwVDAOBgNVHQ8BAf8EBAMC
BaAwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAW
gBT3KuJBMgQEcYrmI1TyGOb0P2/P3zAKBggqhkjOPQQDBANnADBkAjAkfToWryrE
01PNlWEad7iBIwHvm5MvXZOeQV6rLbWD0XhVGaSDDbzLspHZhWaTDr0CMFaUxu1E
cUZg4IA9bHw0i3z+r7/CHPIifhZVJgN4PBB8UavfKVVzpSAXTN6k4EeDEA==
-----END CERTIFICATE-----`,
      metadata: { id: 'mocked-id' },
    });
  });
  it('should reject invalid sign payloads before making a request', async () => {
    await expect(
      client.signCertificate(null as unknown as SignCertificateRequest),
    ).rejects.toThrow(TypeError);
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: '',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        outputFormat: SignOutputFormat.PEM,
      }),
    ).rejects.toThrow('csr');
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: 'mocked-csr',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        validNotBefore:
          42 as unknown as SignCertificateRequest['validNotBefore'],
        outputFormat: SignOutputFormat.PEM,
      }),
    ).rejects.toThrow('validNotBefore');
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: 'mocked-csr',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        subject: 'A'.repeat(1025),
        outputFormat: SignOutputFormat.PEM,
      }),
    ).rejects.toThrow('subject');
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: 'mocked-csr',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        crlDistributionPoints: Array.from(
          { length: 17 },
          () => 'http://example.com/crl',
        ),
        outputFormat: SignOutputFormat.PEM,
      }),
    ).rejects.toThrow('crlDistributionPoints');
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: 'mocked-csr',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        crlDistributionPoints: [42 as unknown as string],
        outputFormat: SignOutputFormat.PEM,
      }),
    ).rejects.toThrow('crlDistributionPoints[0]');
  });

  it('should reject invalid certificate encoding options', async () => {
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: 'mocked-csr',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        outputFormat: SignOutputFormat.UNRECOGNIZED,
      }),
    ).rejects.toThrow('outputFormat');
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
      outputFormat: SignOutputFormat.PEM,
    };
    const response: SignCertificateResponse =
      await client.signCertificate(payload);

    // Test that the response is a subset of the object
    expect(response).toMatchObject({
      pem: `-----BEGIN CERTIFICATE-----
MIICZzCCAe6gAwIBAgIUIxZKFE64ZO/jNqFK1TAMnI1kOcYwCgYIKoZIzj0EAwQw
gYYxCzAJBgNVBAYTAkRFMRAwDgYDVQQIDAdCYXZhcmlhMRowGAYDVQQKDBFUZXN0
LU9yZ2FuaXphdGlvbjEdMBsGA1UECwwUVGVzdC1Pcmdhbml6YXRpb24tQ0ExKjAo
BgNVBAMMIVRlc3QtT3JnYW5pemF0aW9uLUludGVybWVkaWF0ZS1DQTAeFw0yNTA3
MjQwOTAxNTNaFw0yNjA3MjQxMDAxNTNaMEwxCzAJBgNVBAYTAkRFMQswCQYDVQQI
EwJCQTEMMAoGA1UEChMDU0FQMQ8wDQYDVQQDEwZNeUNlcnQxETAPBgNVBAUTCDAx
MjM0NTU2MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEgLWqYJmgsXLUJLta6oIOykuz
GNz76VMZj+wcfb9+MZA5A/WSfPVk9/JigQOfF49JcOI1Wb+gIfq1TNAkK/xOMTjf
pxXeYglrFW/e278Q3TbYvhEHI3kOgIUJDbhSvRn/o1YwVDAOBgNVHQ8BAf8EBAMC
BaAwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAW
gBT3KuJBMgQEcYrmI1TyGOb0P2/P3zAKBggqhkjOPQQDBANnADBkAjAkfToWryrE
01PNlWEad7iBIwHvm5MvXZOeQV6rLbWD0XhVGaSDDbzLspHZhWaTDr0CMFaUxu1E
cUZg4IA9bHw0i3z+r7/CHPIifhZVJgN4PBB8UavfKVVzpSAXTN6k4EeDEA==
-----END CERTIFICATE-----`,
    });

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
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
      outputFormat: SignOutputFormat.PEM,
    };
    const response: SignCertificateResponse =
      await client.signCertificate(payload);

    // Test that the response is a subset of the object
    expect(response).toMatchObject({
      pem: `-----BEGIN CERTIFICATE-----
MIICZzCCAe6gAwIBAgIUIxZKFE64ZO/jNqFK1TAMnI1kOcYwCgYIKoZIzj0EAwQw
gYYxCzAJBgNVBAYTAkRFMRAwDgYDVQQIDAdCYXZhcmlhMRowGAYDVQQKDBFUZXN0
LU9yZ2FuaXphdGlvbjEdMBsGA1UECwwUVGVzdC1Pcmdhbml6YXRpb24tQ0ExKjAo
BgNVBAMMIVRlc3QtT3JnYW5pemF0aW9uLUludGVybWVkaWF0ZS1DQTAeFw0yNTA3
MjQwOTAxNTNaFw0yNjA3MjQxMDAxNTNaMEwxCzAJBgNVBAYTAkRFMQswCQYDVQQI
EwJCQTEMMAoGA1UEChMDU0FQMQ8wDQYDVQQDEwZNeUNlcnQxETAPBgNVBAUTCDAx
MjM0NTU2MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEgLWqYJmgsXLUJLta6oIOykuz
GNz76VMZj+wcfb9+MZA5A/WSfPVk9/JigQOfF49JcOI1Wb+gIfq1TNAkK/xOMTjf
pxXeYglrFW/e278Q3TbYvhEHI3kOgIUJDbhSvRn/o1YwVDAOBgNVHQ8BAf8EBAMC
BaAwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAW
gBT3KuJBMgQEcYrmI1TyGOb0P2/P3zAKBggqhkjOPQQDBANnADBkAjAkfToWryrE
01PNlWEad7iBIwHvm5MvXZOeQV6rLbWD0XhVGaSDDbzLspHZhWaTDr0CMFaUxu1E
cUZg4IA9bHw0i3z+r7/CHPIifhZVJgN4PBB8UavfKVVzpSAXTN6k4EeDEA==
-----END CERTIFICATE-----`,
    });

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
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
  });

  it('should return the mocked benchmark data response', async () => {
    const response: BenchmarkResponse = await client.benchmarkData({});

    // Test that the response is valid and has json-parsable results
    expect(response.benchmarkResults).toBeDefined();
    expect(JSON.parse(response.benchmarkResults)).toHaveProperty('results');
  });
  it('should reject invalid benchmark metadata', async () => {
    await expect(
      client.benchmarkData({
        metadata: {
          id: 'A'.repeat(129),
        },
      }),
    ).rejects.toThrow('metadata.id');
  });

  it('should open the circuit breaker on reaching failure threshold', async () => {
    jest.useFakeTimers();
    const mockedHashDataResponse = {
      metadata: { id: 'mocked-id' },
      hashAlgorithm: 'mocked-algorithm',
      hashValueHex: 'mocked-value',
    };
    (CryptoGrpcClientImpl as jest.Mock).mockImplementationOnce(() => ({
      HashData: jest
        .fn<(input: HashDataRequest) => Promise<HashDataResponse>>()
        .mockResolvedValue(mockedHashDataResponse)
        .mockResolvedValueOnce(mockedHashDataResponse)
        .mockRejectedValueOnce(
          Object.assign(new Error('grpc cancelled'), {
            code: grpc.status.CANCELLED,
          }),
        )
        .mockRejectedValueOnce(
          Object.assign(new Error('grpc unavailable'), {
            code: grpc.status.UNAVAILABLE,
          }),
        ),
    }));

    const client = new CryptoBrokerClient();
    const payload: HashDataRequest = {
      profile: 'Default',
      input: Buffer.from('Testing Data'),
      metadata: { id: 'mocked-id' },
      outputFormat: HashOutputFormat.HEX,
    };

    // the first request should succeed and the circuit remains closed
    await expect(client.hashData(payload)).resolves.toBe(
      mockedHashDataResponse,
    );

    // the second request should return grpc error 1, which is ignored by the
    // CB due to default failureStatusCodes in the configuration
    await jest.advanceTimersByTimeAsync(1000);
    await expect(client.hashData(payload)).rejects.toMatchObject({
      message: 'grpc cancelled',
      code: grpc.status.CANCELLED,
    });

    // the third request should fail and open the circuit due to threshold (33% > 25%)
    await jest.advanceTimersByTimeAsync(1000);
    await expect(client.hashData(payload)).rejects.toMatchObject({
      message: 'grpc unavailable',
      code: grpc.status.UNAVAILABLE,
    });

    // try to request while the circuit is open until it half-opens after 5sec
    for (let i = 0; i < 4; i++) {
      await jest.advanceTimersByTimeAsync(1000);
      await expect(client.hashData(payload)).rejects.toMatchObject({
        message: 'Breaker is open',
        code: 'EOPENBREAKER',
      });
    }
    // after 5 seconds the breaker should be half-open and the request succeed
    await jest.advanceTimersByTimeAsync(1000);
    await expect(client.hashData(payload)).resolves.toBe(
      mockedHashDataResponse,
    );
  });
});
