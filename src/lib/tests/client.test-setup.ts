import { jest } from '@jest/globals';
import {
  BenchmarkRequest,
  BenchmarkResponse,
  DecryptDataRequest,
  DecryptDataResponse,
  EncryptDataRequest,
  EncryptDataResponse,
  HashDataRequest,
  HashDataResponse,
  SignCertificateRequest,
  SignCertificateResponse,
} from '../proto/messages.js';
import {
  HealthCheckRequest,
  HealthCheckResponse,
} from '../proto/third_party/grpc/health/v1/health.js';

// Mock the protobuf client under the hood, returning the same values after doing a gRPC call functions
jest.mock('src/lib/proto/messages.js', () => ({
  HashOutputFormat: {
    HEX: 0,
    RAW: 1,
    UNRECOGNIZED: -1,
  },
  SignOutputFormat: {
    DER: 0,
    PEM: 1,
    UNRECOGNIZED: -1,
  },
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
        if (input.outputFormat === 0) {
          // HEX
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
        if (input.outputFormat === 1) {
          // PEM
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
    EncryptData: jest
      .fn<(input: EncryptDataRequest) => Promise<EncryptDataResponse>>()
      .mockImplementation(async (input) => {
        return {
          ciphertext: Buffer.from(
            '71416b876fb0d65c484ec20106af15a36454743b',
            'hex',
          ),
          cipherMetadata: {
            nonce: Buffer.from('a83f89b37c90f937b8df5011', 'hex'),
            aad: Buffer.from('36e02c2a81c60eca849739d52dea95f7', 'hex'),
            tag: Buffer.from('a77b42e960d89683140cae283a87466e', 'hex'),
          },
          metadata: {
            id: input.metadata?.id || 'empty',
          },
        };
      }),
    DecryptData: jest
      .fn<(input: DecryptDataRequest) => Promise<DecryptDataResponse>>()
      .mockImplementation(async (input) => {
        return {
          plaintext: Buffer.from('Welcome CryptoBroker'),
          metadata: {
            id: input.metadata?.id || 'empty',
          },
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
jest.mock('src/lib/proto/third_party/grpc/health/v1/health.js', () => ({
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
