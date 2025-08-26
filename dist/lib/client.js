import * as grpc from '@grpc/grpc-js';
import { v4 as uuidv4 } from 'uuid';
import { CryptoBrokerClientImpl, } from './proto/messages.js';
export class CryptoBrokerClient {
    client;
    address;
    constructor(opts = {}) {
        this.address = 'unix:/tmp/cryptobroker.sock';
        const conn = new grpc.Client(this.address, opts.credentials || grpc.credentials.createInsecure(), opts.options || {});
        const sendRequest = (service, method, data) => {
            // Conventionally in gRPC, the request path looks like
            //   "package.names.ServiceName/MethodName",
            // we therefore construct such a string
            const path = `/${service}/${method}`;
            return new Promise((resolve, reject) => {
                // makeUnaryRequest transmits the result (and error) with a callback
                // transform this into a promise!
                const resultCallback = (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(res);
                };
                function passThrough(argument) {
                    return argument;
                }
                // Using passThrough as the deserialize functions
                conn.makeUnaryRequest(path, (d) => Buffer.from(d), passThrough, data, resultCallback);
            });
        };
        const rpc = { request: sendRequest };
        this.client = new CryptoBrokerClientImpl(rpc);
    }
    async hashData(payload) {
        const req = {
            profile: payload.profile,
            input: payload.input,
            metadata: {
                id: payload.metadata?.id || uuidv4(),
                createdAt: payload.metadata?.createdAt || new Date().toString(),
            },
        };
        return this.client.Hash(req).then((res) => res);
    }
    async signCertificate(payload) {
        const req = {
            profile: payload.profile,
            csr: payload.csr,
            caPrivateKey: payload.caPrivateKey,
            caCert: payload.caCert,
            metadata: {
                id: payload.metadata?.id || uuidv4(),
                createdAt: payload.metadata?.createdAt || new Date().toString(),
            },
            validNotBeforeOffset: payload.validNotBeforeOffset,
            validNotAfterOffset: payload.validNotAfterOffset,
            subject: payload.subject,
            crlDistributionPoints: payload.crlDistributionPoint || [],
        };
        return this.client.Sign(req).then((res) => res);
    }
}
export const credentials = grpc.credentials;
//# sourceMappingURL=client.js.map