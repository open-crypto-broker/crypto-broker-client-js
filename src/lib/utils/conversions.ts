import { AsnConvert } from '@peculiar/asn1-schema';
import { OneAsymmetricKey, Version } from '@peculiar/asn1-asym-key';
import { SubjectPublicKeyInfo } from '@peculiar/asn1-x509';
import { KeySource, SignKeySource } from '../proto/cryptobroker/v1/messages.js';

export type KeyMode = 'public' | 'private';

const pemPatterns: Record<KeyMode, RegExp> = {
  private:
    /^\s*-----BEGIN ([A-Z0-9 -]*?)PRIVATE KEY-----([A-Za-z0-9+/=\s]*)-----END \1PRIVATE KEY-----\s*$/,
  public:
    /^\s*-----BEGIN ([A-Z0-9 -]*?)PUBLIC KEY-----([A-Za-z0-9+/=\s]*)-----END \1PUBLIC KEY-----\s*$/,
};

const keyDescriptions: Record<KeyMode, string> = {
  private: 'an unencrypted PKCS#8 private key',
  public: 'a SubjectPublicKeyInfo (SPKI) public key',
};

export function toPkcs8(key: Uint8Array, mode: string = 'private'): Uint8Array {
  const pem = new TextDecoder().decode(key).match(pemPatterns[mode]);
  const der = pem ? new Uint8Array(Buffer.from(pem[2], 'base64')) : key;
  const expected = keyDescriptions[mode];

  let parsed: OneAsymmetricKey | SubjectPublicKeyInfo;
  try {
    parsed =
      mode === 'private'
        ? AsnConvert.parse(der, OneAsymmetricKey)
        : AsnConvert.parse(der, SubjectPublicKeyInfo);
  } catch {
    throw new TypeError(`the key must be ${expected}`);
  }

  if (
    parsed instanceof OneAsymmetricKey &&
    parsed.version !== Version.v1 &&
    parsed.version !== Version.v2
  ) {
    throw new TypeError(`the key must be ${expected}`);
  }

  // rejects trailing bytes and non-DER encodings
  const reencoded = new Uint8Array(AsnConvert.serialize(parsed));
  if (!Buffer.from(reencoded).equals(Buffer.from(der))) {
    throw new TypeError(`the key must be DER-encoded: expected ${expected}`);
  }
  return der;
}

export function formatSignKeySource(
  sks: SignKeySource,
  mode: KeyMode,
): SignKeySource {
  // output format is PKCS#8 for all raw keys
  if (sks.single !== undefined && sks.single.rawKey !== undefined) {
    return {
      ...sks,
      single: {
        rawKey: toPkcs8(sks.single.rawKey, mode),
      },
    };
  } else if (sks.componentKeys !== undefined) {
    const nck: KeySource[] = [];
    // do the conversion for each key in the component list
    for (const ks of sks.componentKeys.keys) {
      if (ks.rawKey !== undefined) {
        nck.push({
          rawKey: toPkcs8(ks.rawKey, mode),
        });
      }
    }
    return {
      ...sks,
      componentKeys: {
        keys: nck,
      },
    };
  }
  return sks;
}
