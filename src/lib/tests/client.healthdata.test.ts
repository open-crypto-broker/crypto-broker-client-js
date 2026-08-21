import { describe, expect, it } from '@jest/globals';
import { HealthCheckResponse } from '../proto/third_party/grpc/health/v1/health.js';
import { CryptoBrokerClient } from '../client.js';

describe('CryptoBrokerClient', () => {
  const client: CryptoBrokerClient = new CryptoBrokerClient({
    circuitBreakerOptions: {
      enabled: false,
    },
  });

  it('should return the mocked health response', async () => {
    const servingResponse: HealthCheckResponse = await client.healthData();

    // Test that the response shows the serving status with SERVING
    expect(servingResponse.status).toBeDefined();
    expect(servingResponse.status).toEqual(1);

    const unknownResponse: HealthCheckResponse = await client.healthData();

    // Test that the response shows the serving status with UNKNOWN
    expect(unknownResponse.status).toBeDefined();
    expect(unknownResponse.status).toEqual(0);
  });
});
