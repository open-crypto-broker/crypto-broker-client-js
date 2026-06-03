export const defaultCircuitConfig = {
  enabled: true,
  name: 'crypto-grpc',
  rollingCountTimeout: 120000,
  timeout: 30000,
  errorThresholdPercentage: 25,
  resetTimeout: 5000,
  failureStatusCodes: [
    14, // UNAVAILABLE
    8, // RESOURCE_EXHAUSTED
    10, // ABORTED
  ],
  errorFilter: (err) => {
    // consider only provided failureStatusCodes as errors (i.e. return false)
    return (
      typeof err === 'object' &&
      'code' in err &&
      typeof err.code === 'number' &&
      !defaultCircuitConfig.failureStatusCodes.includes(err.code)
    );
  },
};
