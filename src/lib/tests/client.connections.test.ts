import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CryptoBrokerClient, HashDataOutputFormat } from '../client.js';
import * as grpc from '@grpc/grpc-js';
import {
  CryptoGrpcClientImpl,
  HashDataRequest,
  HashDataResponse,
} from '../proto/messages.js';

describe('CryptoBrokerClient', () => {
  let client: CryptoBrokerClient;

  beforeEach(() => {
    client = new CryptoBrokerClient({
      circuitBreakerOptions: {
        enabled: false,
      },
    });
  });

  it('should use a retry mechanism with NewLibrary', async () => {
    jest.useFakeTimers();

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const waitForReadyMock = jest
      .spyOn(grpc.Client.prototype, 'waitForReady')
      .mockImplementationOnce((_d, cb) => cb(new Error('mocked failure')))
      .mockImplementationOnce((_d, cb) => cb())
      .mockImplementation((_d, cb) => cb(new Error('mocked failure')));

    // at first the connection fails, a retry is run, then the connection and channel readiness succeed
    const retryInstance = await CryptoBrokerClient.NewLibrary();
    expect(waitForReadyMock).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(retryInstance).toBeInstanceOf(CryptoBrokerClient);

    // when the retry limit is reached, NewLibrary will throw an error
    waitForReadyMock.mockClear();
    consoleErrorSpy.mockClear();
    await expect(CryptoBrokerClient.NewLibrary()).rejects.toThrow(
      'retry limit reached',
    );
    expect(waitForReadyMock).toHaveBeenCalledTimes(60);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(60);
  });

  it('should use the clients specified Unix socket', async () => {
    expect(client['address']).toBe(
      'unix:/tmp/open-crypto-broker/crypto-broker-server.sock',
    );
  });

  it('should open the circuit breaker on reaching failure threshold', async () => {
    jest.useFakeTimers();
    const mockedHashDataResponse = {
      metadata: { id: 'mocked-id' },
      hashAlgorithm: 'mocked-algorithm',
      hashValueHex: 'mocked-value',
    };
    (CryptoGrpcClientImpl as jest.Mock).mockImplementationOnce(() => ({
      HashData: jest
        .fn<(input: HashDataRequest) => Promise<HashDataResponse>>()
        .mockResolvedValue(mockedHashDataResponse)
        .mockResolvedValueOnce(mockedHashDataResponse)
        .mockRejectedValueOnce(
          Object.assign(new Error('grpc cancelled'), {
            code: grpc.status.CANCELLED,
          }),
        )
        .mockRejectedValueOnce(
          Object.assign(new Error('grpc unavailable'), {
            code: grpc.status.UNAVAILABLE,
          }),
        ),
    }));

    const client = new CryptoBrokerClient();
    const payload: HashDataRequest = {
      profile: 'Default',
      input: Buffer.from('Testing Data'),
      metadata: { id: 'mocked-id' },
      outputFormat: HashDataOutputFormat.HEX,
    };

    // the first request should succeed and the circuit remains closed
    await expect(client.hashData(payload)).resolves.toBe(
      mockedHashDataResponse,
    );

    // the second request should return grpc error 1, which is ignored by the
    // CB due to default failureStatusCodes in the configuration
    await jest.advanceTimersByTimeAsync(1000);
    await expect(client.hashData(payload)).rejects.toMatchObject({
      message: 'grpc cancelled',
      code: grpc.status.CANCELLED,
    });

    // the third request should fail and open the circuit due to threshold (33% > 25%)
    await jest.advanceTimersByTimeAsync(1000);
    await expect(client.hashData(payload)).rejects.toMatchObject({
      message: 'grpc unavailable',
      code: grpc.status.UNAVAILABLE,
    });

    // try to request while the circuit is open until it half-opens after 5sec
    for (let i = 0; i < 4; i++) {
      await jest.advanceTimersByTimeAsync(1000);
      await expect(client.hashData(payload)).rejects.toMatchObject({
        message: 'Breaker is open',
        code: 'EOPENBREAKER',
      });
    }
    // after 5 seconds the breaker should be half-open and the request succeed
    await jest.advanceTimersByTimeAsync(1000);
    await expect(client.hashData(payload)).resolves.toBe(
      mockedHashDataResponse,
    );
  });
});
