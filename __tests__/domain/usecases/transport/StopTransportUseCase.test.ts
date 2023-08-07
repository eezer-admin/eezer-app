import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AsyncStorageDatabaseRepository } from '@repositories/AsyncStorageDatabaseRepository';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';
import { StopTransportUseCase } from '@usecases/transport/StopTransportUseCase';

describe('StopTransportUseCase', () => {
  const dbRepo = new AsyncStorageDatabaseRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.setSystemTime(new Date('2023-01-01T10:00:00.000Z'));

    container.bind('DatabaseRepository', dbRepo);
  });

  it('stops the transport', async () => {
    const transport = new Transport({ started: new Date().toISOString(), ended: null });

    const result = await new StopTransportUseCase().execute(transport);

    expect(result.isEnded()).toBe(true);
    expect(result.ended).toBe('2023-01-01T10:00:00.000Z');
  });

  it('adds the transport to the top of the log', async () => {
    // Create and persist a log with one transport.
    const log = [new Transport({ started: '2023-01-01T10:00:00.000Z' })];
    const transport = new Transport({ started: '2023-02-01T10:00:00.000Z', ended: '2023-02-01T11:00:00Z' });
    dbRepo.store(STORAGE_KEYS.TRANSPORT_LOG, log);

    // Complete the current transport.
    await new StopTransportUseCase().execute(transport);

    // Get the new log from the storage.
    let result = await dbRepo.get(STORAGE_KEYS.TRANSPORT_LOG);
    result = JSON.parse(result);

    // Assert that the new log has the new transport at the top.
    expect(result[0].identifier).toBe(transport.identifier);
  });

  it('removes the transport from the current transport local storage', async () => {
    const transport = new Transport({ started: '2023-02-01T10:00:00.000Z', ended: '2023-02-01T11:00:00Z' });
    await dbRepo.store(STORAGE_KEYS.TRANSPORT, transport);

    await new StopTransportUseCase().execute(transport);

    const result = await dbRepo.get(STORAGE_KEYS.TRANSPORT);
    expect(result).toBeNull();
  });

  it('creates a new log if there are no transports from before', async () => {
    const transport = new Transport({ started: '2023-02-01T10:00:00.000Z', ended: '2023-02-01T11:00:00Z' });

    await new StopTransportUseCase().execute(transport);

    let result = await dbRepo.get(STORAGE_KEYS.TRANSPORT_LOG);
    result = JSON.parse(result);

    expect(result[0].identifier).toBe(transport.identifier);
  });

  it('sorts the log by start date descending', async () => {
    const log = [
      new Transport({ started: '2023-01-01T10:00:00.000Z' }),
      new Transport({ started: '2023-01-05T10:00:00.000Z' }),
      new Transport({ started: '2023-01-02T10:00:00.000Z' }),
    ];
    const transport = new Transport({ started: '2023-02-01T10:00:00.000Z', ended: '2023-02-01T11:00:00Z' });
    dbRepo.store(STORAGE_KEYS.TRANSPORT_LOG, log);

    await new StopTransportUseCase().execute(transport);

    let result = await dbRepo.get(STORAGE_KEYS.TRANSPORT_LOG);
    result = JSON.parse(result);

    expect(result[0].identifier).toBe(transport.identifier);
    expect(result[1].started).toBe('2023-01-05T10:00:00.000Z');
    expect(result[2].started).toBe('2023-01-02T10:00:00.000Z');
    expect(result[3].started).toBe('2023-01-01T10:00:00.000Z');
  });
});
