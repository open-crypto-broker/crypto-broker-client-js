import { describe, expect, it } from '@jest/globals';
import { BenchmarkResponse } from '../proto/messages.js';
import { isUUID4 } from './client.test-utils.js';
import { CryptoBrokerClient } from '../client.js';

describe('CryptoBrokerClient', () => {
  const client: CryptoBrokerClient = new CryptoBrokerClient({
    circuitBreakerOptions: {
      enabled: false,
    },
  });

  it('benchmark should autofill the metadata', async () => {
    const response: BenchmarkResponse = await client.benchmarkData({});

    // assert that the metadata was correctly autofilled
    expect(response.metadata).toBeDefined();
    expect(response.metadata?.id).not.toEqual('empty');
    expect(isUUID4(response.metadata?.id)).toBeTruthy();
  });

  it('should return the mocked benchmark data response', async () => {
    const response: BenchmarkResponse = await client.benchmarkData({});

    // Test that the response is valid and has json-parsable results
    expect(response.benchmarkResults).toBeDefined();
    expect(JSON.parse(response.benchmarkResults)).toHaveProperty('results');
  });
  it('should reject invalid benchmark metadata', async () => {
    await expect(
      client.benchmarkData({
        metadata: {
          id: 'A'.repeat(129),
        },
      }),
    ).rejects.toThrow('metadata.id');
  });
});
