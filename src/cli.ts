import { CryptoBrokerClient } from './lib/client.js';
import * as fs from 'fs';
import minimist from 'minimist';
import { v4 as uuidv4 } from 'uuid';

const argv = minimist(process.argv.slice(2));

function logDuration(label: string, start: bigint, end: bigint) {
  const durationMicroS = (end - start) / BigInt(1000.0);
  console.log(`${label} took ${durationMicroS} µs`);
}

async function execute(cryptoLib: CryptoBrokerClient) {
  const command = argv['_'][0];
  const profile = argv['profile'] || 'Default';

  // Data hashing
  if (command === 'hash') {
    // Usage: hash <data> <--profile=profile>
    const [data] = argv['_'].slice(1);
    if (!data || !profile) {
      throw new Error(
        'Hash command requires 2 arguments: <data> and <profile>',
      );
    }
    console.log(`Hashing '${data}' using ${profile} profile`);
    const start = process.hrtime.bigint();
    const hashResponse = await cryptoLib.hashData({
      profile: profile,
      input: Buffer.from(data),
      metadata: {
        id: uuidv4(),
        createdAt: new Date().toString(),
      },
    });
    const end = process.hrtime.bigint();

    console.log('Hashed response:\n', JSON.stringify(hashResponse, null, 2));
    logDuration('Data Hashing', start, end);

    // Certificate signing
  } else if (command === 'sign') {
    // Usage: sign <--profile=profile> <csrPath> <signingKeyPath> <caCertPath>
    const [csrPath, caCertPath, signingKeyPath] = argv['_'].slice(1);
    if (!profile || !csrPath || !signingKeyPath || !caCertPath) {
      throw new Error(
        'Usage: cert <profile> <csrPath> <signingKeyPath> <caCertPath>',
      );
    }
    const csr = fs.readFileSync(csrPath, 'utf8');
    const caCert = fs.readFileSync(caCertPath, 'utf8');
    const caPrivateKey = fs.readFileSync(signingKeyPath, 'utf8');

    // Starting certificate signing
    const start = process.hrtime.bigint();
    const signResponse = await cryptoLib.signCertificate({
      profile: profile,
      csr: csr,
      caPrivateKey: caPrivateKey,
      caCert: caCert,
      metadata: {
        id: uuidv4(),
        createdAt: new Date().toString(),
      },
      subject: 'SERIALNUMBER =01234556, CN=MyCert, O=SAP, ST=BA, C=DE',
    });
    const end = process.hrtime.bigint();
    console.log('Sign response:\n', JSON.stringify(signResponse, null, 2));
    logDuration('Certificate Signing', start, end);
  } else {
    throw new Error(
      `Unsupported command '${command}, only available commands are hash and sign'`,
    );
  }
}

async function main() {
  const cryptoLib = new CryptoBrokerClient();
  const isDeployed = process.env.DOCKER_DEPLOYED || '';

  if (isDeployed.toLowerCase() === 'true') {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    while (true) {
      await sleep(5000);
      await execute(cryptoLib);
    }
  } else {
    await execute(cryptoLib);
  }
}

main().catch((err) => {
  console.log('Error:', err);
});
