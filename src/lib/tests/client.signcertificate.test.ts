import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CryptoBrokerClient, SignCertificateOutputFormat } from '../client.js';
import {
  SignCertificateRequest,
  PayloadLimits,
  SignCertificateResponse,
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

  it('should return mocked sign certificate response', async () => {
    const payload: SignCertificateRequest = {
      profile: 'Default',
      csr: 'mocked-csr',
      caPrivateKey: 'mocked-key',
      caCert: 'mocked-cert',
      metadata: { id: 'mocked-id' },
      subject: 'CN=Test',
      crlDistributionPoints: ['http://example.com/crl'],
      outputFormat: SignCertificateOutputFormat.SIGN_OUTPUT_FORMAT_PEM,
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
      descriptor: {
        profile: 'Default',
        operation: 'SignCertificate',
        algorithm: 'ecdsa384-sha3-512',
      },
      metadata: { id: 'mocked-id' },
    });
  });
  it.each<[Partial<SignCertificateRequest>, string]>([
    [{ profile: '' }, 'profile'],
    [
      { profile: 'A'.repeat(PayloadLimits.PAYLOAD_LIMITS_PROFILE_MAX_LEN + 1) },
      'profile',
    ],
    [{ caPrivateKey: '' }, 'caPrivateKey'],
    [{ caCert: '' }, 'caCert'],
    [
      {
        csr: 'A'.repeat(
          PayloadLimits.PAYLOAD_LIMITS_SIGN_CERTIFICATE_CSR_MAX_LEN + 1,
        ),
      },
      'csr',
    ],
    [
      {
        caPrivateKey: 'A'.repeat(
          PayloadLimits.PAYLOAD_LIMITS_SIGN_CERTIFICATE_CA_PRIVATE_KEY_MAX_LEN +
            1,
        ),
      },
      'caPrivateKey',
    ],
    [
      {
        caCert: 'A'.repeat(
          PayloadLimits.PAYLOAD_LIMITS_SIGN_CERTIFICATE_CA_CERT_MAX_LEN + 1,
        ),
      },
      'caCert',
    ],
    [
      {
        crlDistributionPoints: [
          'A'.repeat(
            PayloadLimits.PAYLOAD_LIMITS_SIGN_CERTIFICATE_DISTRIBUTION_POINT_MAX_LEN +
              1,
          ),
        ],
      },
      'crlDistributionPoints[0]',
    ],
  ])('should reject invalid certificate fields (%#)', async (fields, field) => {
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: 'mocked-csr',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        outputFormat: SignCertificateOutputFormat.SIGN_OUTPUT_FORMAT_PEM,
        ...fields,
      } as SignCertificateRequest),
    ).rejects.toThrow(field);
    expect(client['client'].SignCertificate).not.toHaveBeenCalled();
  });

  it('should reject invalid sign certificate payloads before making a request', async () => {
    await expect(
      client.signCertificate(null as unknown as SignCertificateRequest),
    ).rejects.toThrow(TypeError);
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: '',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        outputFormat: SignCertificateOutputFormat.SIGN_OUTPUT_FORMAT_PEM,
      }),
    ).rejects.toThrow('csr');
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: 'mocked-csr',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        validNotBefore: BigInt(
          '18446744073709551616', // which is maxUint64 + 1
        ) as unknown as SignCertificateRequest['validNotBefore'],
        outputFormat: SignCertificateOutputFormat.SIGN_OUTPUT_FORMAT_PEM,
      }),
    ).rejects.toThrow('validNotBefore');
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: 'mocked-csr',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        subject: 'A'.repeat(1025),
        outputFormat: SignCertificateOutputFormat.SIGN_OUTPUT_FORMAT_PEM,
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
        outputFormat: SignCertificateOutputFormat.SIGN_OUTPUT_FORMAT_PEM,
      }),
    ).rejects.toThrow('crlDistributionPoints');
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: 'mocked-csr',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        crlDistributionPoints: [42 as unknown as string],
        outputFormat: SignCertificateOutputFormat.SIGN_OUTPUT_FORMAT_PEM,
      }),
    ).rejects.toThrow('crlDistributionPoints[0]');
    expect(client['client'].SignCertificate).not.toHaveBeenCalled();
  });

  it('should reject invalid certificate encoding options', async () => {
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: 'mocked-csr',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        outputFormat: SignCertificateOutputFormat.UNRECOGNIZED,
      }),
    ).rejects.toThrow('outputFormat');
    expect(client['client'].SignCertificate).not.toHaveBeenCalled();
  });

  it('sign certificate should autofill the metadata', async () => {
    const payload = {
      profile: 'Default',
      csr: 'mocked-csr',
      caPrivateKey: 'mocked-key',
      caCert: 'mocked-cert',
      validNotBeforeOffset: '0',
      validNotAfterOffset: '1',
      subject: 'CN=Test',
      crlDistributionPoints: ['http://example.com/crl'],
      outputFormat: SignCertificateOutputFormat.SIGN_OUTPUT_FORMAT_PEM,
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
      descriptor: {
        profile: 'Default',
        operation: 'SignCertificate',
        algorithm: 'ecdsa384-sha3-512',
      },
    });

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
  });

  it('should return mocked sign certificate response (PEM-encoded)', async () => {
    const payload = {
      profile: 'Default',
      csr: 'mocked-csr',
      caPrivateKey: 'mocked-key',
      caCert: 'mocked-cert',
      validNotBeforeOffset: '0',
      validNotAfterOffset: '1',
      subject: 'CN=Test',
      crlDistributionPoints: ['http://example.com/crl'],
      outputFormat: SignCertificateOutputFormat.SIGN_OUTPUT_FORMAT_PEM,
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
      descriptor: {
        profile: 'Default',
        operation: 'SignCertificate',
        algorithm: 'ecdsa384-sha3-512',
      },
    });

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
  });
});
