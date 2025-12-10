# Crypto Broker Client

## Usage

The Crypto Broker Client is a Node.js library written in Typescript that allows users to interact with a Crypto Broker Server running on the same machine. The library is a lightweight wrapper around the communication protocol (gRPC) and the basic structures used to call the server from a JS client.

### Installation

`TODO`: Change this once the package is published to npm.js

Optionally, you can also directly download the package `cryptobroker-client-x.x.x.tgz` from the Releases (`TODO`: Insert releases link here) folder into your development environment. Then, from the node.js project you want to install it, simply install it with:

```bash
npm install <path-to-cryptobroker-client-x.y.z.tgz>
```

Alternatively, you can also reference this git repository:

```bash
npm install github:open-crypto-broker/crypto-broker-client-js
```

### Library Usage

To use the Crypto Broker Library, simply create a client instance and call the functions with the specified parameters.

```ts
import { CertEncoding, CryptoBrokerClient } from "cryptobroker-client";
import { v4 as uuidv4 } from 'uuid';

const cryptoLib = new CryptoBrokerClient();

const hashResponse = await cryptoLib.hashData({
    profile: profile,
    input: Buffer.from(data),
    // Optional values
    metadata: {
        id : uuidv4(),
        createdAt: new Date().toString()
    },
});
console.log(`Hashed response: ${hashResponse.hashValue}`);

const signResponse = await cryptoLib.signCertificate({
    profile: profile,
    csr: csr,
    caPrivateKey: caPrivateKey,
    caCert: caCert,
    // Optional values
    validNotBefore: Math.floor(new Date().getTime() / 1000), // now
    validNotAfter: Math.floor(new Date().getTime() / 1000 + 86400 * 30), // 30 days
    subject: "CN=MyCert,O=SAP,ST=BA,C=DE",
    crlDistributionPoint: "URL Distribution Point",
    metadata: {
        id: uuidv4(),
        createdAt: new Date().toString(),
    },
});
console.log("Certificate signed by CryptoBroker in PEM format\n", signResponse.signedCertificate)
```

If desired, options for the certificate encoding output can be specified as follows:

```ts
const options = {
    encoding: CertEncoding.B64,  // encode as Base64 string, default is PEM
}
const signResponse = await cryptoLib.signCertificate({...}, options);
```

Further, it is also possible to check the health status of the server:

```ts
import { HealthCheckResponse_ServingStatus } from 'cryptobroker-client';

const health_data = await cryptoLib.healthData();
const serving_status = HealthCheckResponse_ServingStatus[health_data.status];
console.log('Status: ', serving_status);
```

Note, that the possible status values are described in the [specification](https://github.com/open-crypto-broker/crypto-broker-documentation).

## Development

This section covers how to contribute to the project and develop it further.

### Pre-requisites

In order to develop, build and test the project locally, you need Node.js installed and run the installation with `npm install`.

For running commands using the `Taskfile` tool, you need to have Taskfile installed. Please check the documentation on [how to install Taskfile](https://taskfile.dev/installation/). If you don't have Taskfile support, you can directly use the commands specified in the Taskfile on your local terminal, provided you meet the requirements.

If you want to update the protobuf files you need to install the [protoc](https://protobuf.dev/installation/) tool and run the proto task:

```bash
task tools && task proto
```

Note: The task assumes that "apt" is your package manager.

Please note, that the generated files are supposed to be committed to the repository.

Additionally, this repository uses husky as a pre-commit hook for the project.
Make sure to run `npm install` at least once before committing to this repository.

The [server repository](https://github.com/open-crypto-broker/crypto-broker-server/), is recommended in order to perform end-to-end testing.

### Building

The source code is under the `/src` folder. This code is compiled and the output saved in the `/dist` folder.
To compile the binaries you can use `npm run build`, or simply use the Taskfile:

```bash
task build
```

### Testing

The client uses `jest` as a testing framework. The only logic tested is the one of the client itself. For this, the gRPC server functions are mocked, and their responses hard-coded. The purpose of this testing is thus to ensure compliance project-wide and that the client follows the general [library's specification](https://github.com/open-crypto-broker/crypto-broker-documentation/blob/main/spec/0003-library.md). For a full end-to-end testing, please check the [deployment repository](https://github.com/open-crypto-broker/crypto-broker-deployment).

To start the tests you can use `npm run test`, or simply use the Taskfile:

```bash
task unit-test
```

If you want to additionally invoke the local pipeline for code formatting, testing and vulnerability checks,
you can run all of these commands with:

```bash
task ci
```

The same pipeline will run in GitHub Actions when submitting a Pull Request, so it is recommended to also clone and run the testing of the deployment repository.

## Deployment

For an example deployment and end-to-end tests you can use the [deployment repository](https://github.com/open-crypto-broker/crypto-broker-deployment).

## Support, Feedback, Contributing

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/open-crypto-broker/crypto-broker-client-js/issues). Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).

## Security / Disclosure

If you find any bug that may be a security problem, please follow our instructions at [in our security policy](https://github.com/open-crypto-broker/crypto-broker-client-js/security/policy) on how to report it. Please do not create GitHub issues for security-related doubts or problems.

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](https://github.com/open-crypto-broker/.github/blob/main/CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright 2025 SAP SE or an SAP affiliate company and Open Crypto Broker contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/open-crypto-broker/crypto-broker-client-js).
