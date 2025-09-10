import { CryptoBrokerClient } from './lib/client.js';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ArgumentParser } from 'argparse';
function logDuration(label, start, end) {
    const durationMicroS = (end - start) / BigInt(1000.0);
    console.log(`${label} took ${durationMicroS} µs`);
}
async function execute(cryptoLib) {
    const parser = new ArgumentParser();
    const sub_parsers = parser.add_subparsers({
        help: 'Command Selection',
        dest: 'command',
    });
    // main parser arguments
    parser.add_argument('--profile', {
        help: 'Profile Selection',
        default: 'Default',
    });
    // hash sub-parser and arguments
    const hash_parser = sub_parsers.add_parser('hash', {
        help: 'create a hash',
    });
    hash_parser.add_argument('data');
    // sign sub-parser and arguments
    const sign_parser = sub_parsers.add_parser('sign', {
        help: 'sign a CSR etc',
    });
    sign_parser.add_argument('csrPath', {
        help: 'Path to CSR file',
    });
    sign_parser.add_argument('caCertPath', {
        help: 'Path to CA cert file',
    });
    sign_parser.add_argument('signingKeyPath', {
        help: 'Path to CA private key file',
    });
    const parsed_args = parser.parse_args();
    const command = parsed_args.command;
    const profile = parsed_args.profile || 'Default';
    // Data hashing
    // Usage: cli.js [--profile=<profile>] hash <data>
    if (command === 'hash') {
        const data = parsed_args.data;
        console.log(`Hashing '${data}' using "${profile}" profile`);
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
        // Usage: cli.js [--profile=<profile>] sign <csrPath> <caCertPath> <signingKeyPath>
    }
    else if (command === 'sign') {
        const csrPath = parsed_args.csrPath;
        const caCertPath = parsed_args.caCertPath;
        const signingKeyPath = parsed_args.signingKeyPath;
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
            subject: 'SERIALNUMBER=01234556,CN=MyCert,O=SAP,ST=BA,C=DE',
            metadata: {
                id: uuidv4(),
                createdAt: new Date().toString(),
            },
        });
        const end = process.hrtime.bigint();
        console.log('Sign response:\n', JSON.stringify(signResponse, null, 2));
        logDuration('Certificate Signing', start, end);
    }
}
async function main() {
    const cryptoLib = new CryptoBrokerClient();
    const isDeployed = process.env.DOCKER_DEPLOYED || '';
    if (isDeployed.toLowerCase() === 'true') {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        while (true) {
            await sleep(5000);
            await execute(cryptoLib);
        }
    }
    else {
        await execute(cryptoLib);
    }
}
main().catch((err) => {
    console.log('Error:', err);
});
//# sourceMappingURL=cli.js.map