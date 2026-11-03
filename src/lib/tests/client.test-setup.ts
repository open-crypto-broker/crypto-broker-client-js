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
  HashOutputFormat,
  SignCertificateRequest,
  SignCertificateResponse,
  SignDataRequest,
  SignDataResponse,
  SignOutputFormat,
  VerifyDataRequest,
  VerifyDataResponse,
} from '../proto/cryptobroker/v1/messages.js';
import {
  HealthCheckRequest,
  HealthCheckResponse,
} from '../proto/third_party/grpc/health/v1/health.js';

// Mock the protobuf client under the hood, returning the same values after doing a gRPC call functions
jest.mock('src/lib/proto/cryptobroker/v1/messages.js', () => {
  const originalMessages = jest.requireActual<
    typeof import('../proto/cryptobroker/v1/messages.js')
  >('../proto/cryptobroker/v1/messages.js');

  return {
    // note, that the original messages are the default and then overwritten
    // for providing a serverless response mock
    ...originalMessages,
    CryptoServiceClientImpl: jest.fn().mockImplementation(() => ({
      HashData: jest
        .fn<(input: HashDataRequest) => Promise<HashDataResponse>>()
        .mockImplementation(async (input) => {
          const base = {
            descriptor: {
              profile: 'Default',
              operation: 'HashData',
              algorithm: 'sha3-512',
            },
            metadata: {
              id: input.metadata?.id || 'empty',
            },
          };
          if (input.outputFormat === HashOutputFormat.HASH_OUTPUT_FORMAT_HEX) {
            // HEX
            return {
              ...base,
              hashValueHex:
                'e2e1c9e522efb2495a178434c8bb8f11000ca23f1fd679058b7d7e141f0cf3433f94fc427ec0b9bebb12f327a3240021053db6091196576d5e6d9bd8fac71c0c',
            };
          }
          return {
            ...base,
            hashValueRaw: Buffer.from(
              'e2e1c9e522efb2495a178434c8bb8f11000ca23f1fd679058b7d7e141f0cf3433f94fc427ec0b9bebb12f327a3240021053db6091196576d5e6d9bd8fac71c0c',
              'hex',
            ),
          };
        }),
      SignCertificate: jest
        .fn<
          (input: SignCertificateRequest) => Promise<SignCertificateResponse>
        >()
        .mockImplementation(async (input) => {
          const base = {
            descriptor: {
              profile: 'Default',
              operation: 'SignCertificate',
              algorithm: 'ecdsa384-sha3-512',
            },
            metadata: {
              id: input.metadata?.id || 'empty',
            },
          };
          if (input.outputFormat === SignOutputFormat.SIGN_OUTPUT_FORMAT_PEM) {
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
            descriptor: {
              profile: 'Default',
              operation: 'EncryptData',
              algorithm: 'aes-gcm',
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
      SignData: jest
        .fn<(input: SignDataRequest) => Promise<SignDataResponse>>()
        .mockImplementation(async (input) => {
          return {
            signature: Buffer.from('mocked-signature'),
            descriptor: {
              profile: input.profile,
              operation: 'SignData',
              algorithm: 'ecdsa-sha-512',
            },
            metadata: {
              id: input.metadata?.id || 'empty',
            },
          };
        }),
      VerifyData: jest
        .fn<(input: VerifyDataRequest) => Promise<VerifyDataResponse>>()
        .mockImplementation(async (input) => {
          return {
            valid: true,
            metadata: {
              id: input.metadata?.id || 'empty',
            },
          };
        }),
    })),
    CryptoDevServiceClientImpl: jest.fn().mockImplementation(() => ({
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
  };
});

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
