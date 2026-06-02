export const defaultCircuitConfig = {
  enabled: true,
  name: 'crypto-grpc',
  maxRequests: 3,
  interval: 30,
  timeout: 5,
  consecutiveFailures: 3,
  failureStatusCodes: [
    14, // UNAVAILABLE
    8, // RESOURCE_EXHAUSTED
    10, // ABORTED
  ],
};
