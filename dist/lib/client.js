import * as grpc from '@grpc/grpc-js';
import { v4 as uuidv4 } from 'uuid';
import x509 from '@peculiar/x509';
import { CryptoGrpcClientImpl, } from './proto/messages.js';
import { HealthCheckResponse_ServingStatus, HealthClientImpl, } from './proto/third_party/grpc/health/v1/health.js';
export var CertEncoding;
(function (CertEncoding) {
    CertEncoding["B64"] = "B64";
    CertEncoding["PEM"] = "PEM";
})(CertEncoding || (CertEncoding = {}));
const encoders = {
    [CertEncoding.B64]: (input) => input, // the server provides this already
    [CertEncoding.PEM]: (input) => {
        const cert = new x509.X509Certificate(input.signedCertificate);
        input.signedCertificate = cert.toString();
        return input;
    },
};
export class CryptoBrokerClient {
    client;
    healthClient;
    address;
    conn_max_retries = 60;
    conn_retry_delay_ms = 1000;
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
                const sendRetryRequest = (tries = 1) => {
                    const now = new Date();
                    const deadline = now.setMilliseconds(now.getMilliseconds() + this.conn_retry_delay_ms);
                    if (tries <= this.conn_max_retries) {
                        conn.waitForReady(deadline, async (err) => {
                            if (err) {
                                console.log(`Could not establish connection. Retrying... (${tries}/${this.conn_max_retries})`);
                                sendRetryRequest(tries + 1);
                            }
                            else {
                                // Using passThrough as the deserialize functions
                                conn.makeUnaryRequest(path, (d) => Buffer.from(d), passThrough, data, resultCallback);
                            }
                        });
                    }
                    else
                        reject(Error('retry limit reached'));
                };
                // retry until a connection was successful or the maximum retry amount was reached
                sendRetryRequest();
            });
        };
        const rpc = { request: sendRequest };
        const hcRpc = {
            request: sendRequest,
        };
        this.client = new CryptoGrpcClientImpl(rpc);
        this.healthClient = new HealthClientImpl(hcRpc);
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
    async signCertificate(payload, options) {
        // Prepare the Request
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
        // Apply options
        const encoding = (options && options.encoding) || CertEncoding.PEM;
        // Send the Request
        return this.client
            .Sign(req)
            .then((res) => encoders[encoding](res));
    }
    async healthData() {
        const req = {
            service: '',
        };
        // mocking unknown status in the case the server is not reachable
        const status_unknown = {
            status: HealthCheckResponse_ServingStatus.UNKNOWN,
        };
        return this.healthClient
            .Check(req)
            .then((res) => res)
            .catch(() => status_unknown);
    }
}
export const credentials = grpc.credentials;
export { HealthCheckResponse_ServingStatus } from './proto/third_party/grpc/health/v1/health.js';
//# sourceMappingURL=client.js.map