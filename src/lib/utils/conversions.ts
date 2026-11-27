import { KeySource, SignKeySource } from '../proto/cryptobroker/v1/messages.js';

type KeyMode = 'public' | 'private';

function toPKCS8DER(key: Uint8Array, mode: KeyMode): Uint8Array {
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

  // if the key does not have the PEM format, we assume it to be DER already -
  // see also "Raw Key Validation" in the Specification.
  const decodedKey = new TextDecoder().decode(key);
  const isPrivate = mode === 'private';

  // checking if key privacy matches the isPrivate parameter
  const pem = decodedKey.match(pemPatterns[mode]);
  if (!pem && decodedKey.match(pemPatterns[isPrivate ? 'public' : 'private'])) {
    throw new TypeError(
      `Unexpected Key: The key must be ${keyDescriptions[mode]}`,
    );
  }
  // checking for pem if the header indicates the unencrypted PKCS#8 variant (via pem[1] match)
  if (pem && pem[1] !== '') {
    throw new TypeError(
      `Unsupported Key: The key must be ${keyDescriptions[mode]}!`,
    );
  }

  return pem ? new Uint8Array(Buffer.from(pem[2], 'base64')) : key;
}

export function formatValidateSignKeySource(
  sks: SignKeySource,
  mode: KeyMode,
): SignKeySource {
  // output format is PKCS#8 for all raw keys
  if (sks.single !== undefined) {
    return {
      ...sks,
      single: {
        ...(sks.single.rawKey !== undefined && {
          rawKey: toPKCS8DER(sks.single.rawKey, mode),
        }),
        ...(sks.single.keyId !== undefined && { keyId: sks.single.keyId }),
      },
    };
  }
  if (sks.componentKeys !== undefined) {
    const newComponentKeyList: KeySource[] = [];
    // do the conversion for each key in the component list
    for (const ks of sks.componentKeys.keys) {
      console.error(ks);
      // either rawKey or keyId must be supplied, which is validated before
      if (ks.rawKey !== undefined) {
        newComponentKeyList.push({
          rawKey: toPKCS8DER(ks.rawKey, mode),
        });
      } else {
        newComponentKeyList.push({
          keyId: ks.keyId,
        });
      }
    }
    return {
      ...sks,
      componentKeys: {
        keys: newComponentKeyList,
      },
    };
  }
  throw new Error('SignKeySource is invalid');
}
