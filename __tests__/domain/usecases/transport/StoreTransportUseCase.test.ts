import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { MockDatabaseRepository, mockTransport } from '@tests/utils';
import { StoreTransportUseCase } from '@usecases/transport/StoreTransportUseCase';

describe('StoreTransportUseCase', () => {
  const dbRepo = new MockDatabaseRepository();

  beforeEach(() => {
    jest.clearAllMocks();

    container.bind('DatabaseRepository', dbRepo);
  });

  it('stores the transport in the storage', async () => {
    jest.spyOn(dbRepo, 'store');

    (dbRepo.store as jest.Mock).mockResolvedValueOnce(true);

    const result = await new StoreTransportUseCase().execute(mockTransport);

    expect(dbRepo.store).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT, mockTransport);
    expect(result).toEqual(true);
  });
});
