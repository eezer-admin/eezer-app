import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';
import { MockDatabaseRepository } from '@tests/utils';
import { StartTransportUseCase } from '@usecases/transport/StartTransportUseCase';

describe('StartTransportUseCase', () => {
  const dbRepo = new MockDatabaseRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.setSystemTime(new Date('2023-01-01T10:00:00.000Z'));

    container.bind('DatabaseRepository', dbRepo);
  });

  it('starts the transport', async () => {
    const transport = new Transport({ started: null, ended: null });

    const result = await new StartTransportUseCase().execute(transport);

    expect(result.isStarted()).toBe(true);
    expect(result.started).toBe('2023-01-01T10:00:00.000Z');
  });

  it('persists the changes', async () => {
    jest.spyOn(dbRepo, 'store');

    (dbRepo.store as jest.Mock).mockResolvedValueOnce(true);

    const transport = new Transport({ started: null, ended: null });

    await new StartTransportUseCase().execute(transport);

    expect(dbRepo.store).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT, transport);
  });
});
