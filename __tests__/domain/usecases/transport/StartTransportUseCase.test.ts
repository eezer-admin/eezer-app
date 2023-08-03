import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS, TRANSPORT_REASON } from '@src/Constants';
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

    const result = await new StartTransportUseCase().execute(transport, TRANSPORT_REASON.DELIVERY, 1);

    expect(result.isStarted()).toBe(true);
    expect(result.started).toBe('2023-01-01T10:00:00.000Z');
  });

  it('sets the reason', async () => {
    const transport = new Transport({ started: null, ended: null });

    const result = await new StartTransportUseCase().execute(transport, TRANSPORT_REASON.OTHER, 1);

    expect(result.reason).toBe(TRANSPORT_REASON.OTHER);
  });

  it('sets the vehicle id', async () => {
    const transport = new Transport({ started: null, ended: null });

    const result = await new StartTransportUseCase().execute(transport, TRANSPORT_REASON.OTHER, 32);

    expect(result.vehicleId).toBe(32);
  });

  it('persists the changes', async () => {
    jest.spyOn(dbRepo, 'store');

    (dbRepo.store as jest.Mock).mockResolvedValueOnce(true);

    const transport = new Transport({ started: null, ended: null });

    await new StartTransportUseCase().execute(transport, TRANSPORT_REASON.DELIVERY, 1);

    expect(dbRepo.store).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT, transport);
  });
});
