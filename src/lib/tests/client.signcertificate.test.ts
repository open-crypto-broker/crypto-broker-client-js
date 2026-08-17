import { describe, expect, it } from '@jest/globals';
import { CryptoBrokerClient, SignCertificateOutputFormat } from '../client.js';
import {
  SignCertificateRequest,
  SignCertificateResponse,
} from '../proto/messages.js';
import { isUUID4 } from './client.test-utils.js';

describe('CryptoBrokerClient', () => {
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
      outputFormat: SignCertificateOutputFormat.PEM,
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
        outputFormat: SignCertificateOutputFormat.PEM,
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
        outputFormat: SignCertificateOutputFormat.PEM,
      }),
    ).rejects.toThrow('validNotBefore');
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: 'mocked-csr',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        subject: 'A'.repeat(1025),
        outputFormat: SignCertificateOutputFormat.PEM,
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
        outputFormat: SignCertificateOutputFormat.PEM,
      }),
    ).rejects.toThrow('crlDistributionPoints');
    await expect(
      client.signCertificate({
        profile: 'Default',
        csr: 'mocked-csr',
        caPrivateKey: 'mocked-key',
        caCert: 'mocked-cert',
        crlDistributionPoints: [42 as unknown as string],
        outputFormat: SignCertificateOutputFormat.PEM,
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
        outputFormat: SignCertificateOutputFormat.UNRECOGNIZED,
      }),
    ).rejects.toThrow('outputFormat');
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
      outputFormat: SignCertificateOutputFormat.PEM,
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
      outputFormat: SignCertificateOutputFormat.PEM,
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
});
