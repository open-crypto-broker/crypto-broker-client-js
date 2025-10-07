import { CertEncoding, CryptoBrokerClient } from './lib/client.js';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ArgumentParser, ArgumentDefaultsHelpFormatter, ArgumentTypeError, } from 'argparse';
function logDuration(label, start, end) {
    const durationMicroS = (end - start) / BigInt(1000.0);
    console.log(`${label} took ${durationMicroS} µs`);
}
function init_parser() {
    const parser = new ArgumentParser({
        formatter_class: ArgumentDefaultsHelpFormatter,
    });
    const sub_parsers = parser.add_subparsers({
        help: 'Command Selection',
        dest: 'command',
    });
    // main parser arguments
    parser.add_argument('--profile', {
        help: 'Profile Selection',
        default: 'Default',
    });
    parser.add_argument('--loop', {
        help: 'Loops the request with the specified delay (in ms).',
        dest: 'delay',
        type: (arg) => {
            const int_arg = parseInt(arg);
            if (int_arg <= 0 || int_arg > 1000) {
                throw new ArgumentTypeError('The delay value must be between 1ms and 1000ms.');
            }
            return int_arg;
        },
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
    sign_parser.add_argument('--encoding', {
        default: CertEncoding.PEM,
        choices: CertEncoding,
        help: 'Specifies which encoding should be used for the signedCertificate',
    });
    sign_parser.add_argument('--subject', {
        help: 'Subject for the signing request (will override the subject in the CSR)',
    });
    return parser.parse_args();
}
// initializes the parsers
const parsed_args = init_parser();
async function execute(cryptoLib) {
    const command = parsed_args.command;
    const profile = parsed_args.profile;
    // Data hashing
    // Usage: cli.js [--profile <profile>] [--loop <delay>] hash <data>
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
        if (parsed_args.data_only)
            console.log(hashResponse.hashValue);
        console.log('Hashed response:\n', JSON.stringify(hashResponse, null, 2));
        logDuration('Data Hashing', start, end);
        // Certificate signing
        // Usage: cli.js [--profile <profile>] [--loop <delay>] sign <csrPath> <caCertPath> <signingKeyPath> [--encoding={B64,PEM}] [--subject]
    }
    else if (command === 'sign') {
        const csrPath = parsed_args.csrPath;
        const caCertPath = parsed_args.caCertPath;
        const signingKeyPath = parsed_args.signingKeyPath;
        const encoding = parsed_args.encoding;
        const subject = parsed_args.subject;
        const options = {
            encoding: encoding,
        };
        const csr = fs.readFileSync(csrPath, 'utf8');
        const caCert = fs.readFileSync(caCertPath, 'utf8');
        const caPrivateKey = fs.readFileSync(signingKeyPath, 'utf8');
        const payload = {
            profile: profile,
            csr: csr,
            caPrivateKey: caPrivateKey,
            caCert: caCert,
            metadata: {
                id: uuidv4(),
                createdAt: new Date().toString(),
            },
        };
        // add subject to payload if it was provided
        if (subject) {
            payload['subject'] = subject;
            console.log(`Note: The CSR subject will be overwritten by "${subject}".`);
        }
        // Starting certificate signing
        const start = process.hrtime.bigint();
        const signResponse = await cryptoLib.signCertificate(payload, options);
        const end = process.hrtime.bigint();
        console.log('Sign response:\n', JSON.stringify(signResponse, null, 2));
        logDuration('Certificate Signing', start, end);
    }
}
async function main() {
    const cryptoLib = new CryptoBrokerClient();
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    // signal handling
    let stop = false;
    process.on('SIGINT', () => {
        stop = true;
        console.log('Received SIGINT, stopping...');
    });
    process.on('SIGTERM', () => {
        stop = true;
        console.log('Received SIGTERM, stopping...');
    });
    await execute(cryptoLib);
    while (parsed_args.delay) {
        await sleep(parsed_args.delay);
        if (stop)
            break;
        await execute(cryptoLib);
    }
}
main().catch((err) => {
    console.error('Error:', err);
});
//# sourceMappingURL=cli.js.map