export interface CircuitBreakerConfig {
  enabled: boolean;
  name?: string;
  rollingCountTimeout?: number;
  timeout?: number;
  errorThresholdPercentage?: number;
  resetTimeout?: number;
  failureStatusCodes?: number[]; // grpc status codes to be considered as failure
  errorFilter?: (err: Error) => boolean;
}

export const circuitBreakerConfigFactory = (
  override?: CircuitBreakerConfig,
): CircuitBreakerConfig => {
  const defaultConfig: CircuitBreakerConfig = {
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
  };
  const failureStatusCodes =
    override?.failureStatusCodes ?? defaultConfig.failureStatusCodes ?? [];
  return {
    ...defaultConfig,
    ...override,
    errorFilter: (err) => {
      // consider only provided failureStatusCodes as errors (i.e. return false)
      return (
        typeof err === 'object' &&
        'code' in err &&
        typeof err.code === 'number' &&
        !failureStatusCodes.includes(err.code)
      );
    },
  };
};
