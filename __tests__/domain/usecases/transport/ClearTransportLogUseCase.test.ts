import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { MockDatabaseRepository } from '@tests/utils';
import { ClearTransportLogUseCase } from '@usecases/transport/ClearTransportLogUseCase';

describe('ClearTransportLogUseCase', () => {
  const dbRepo = new MockDatabaseRepository();

  beforeEach(() => {
    jest.clearAllMocks();

    container.bind('DatabaseRepository', dbRepo);
  });

  it('deletes the transport log from the storage', async () => {
    jest.spyOn(dbRepo, 'delete');

    (dbRepo.delete as jest.Mock).mockResolvedValueOnce(true);

    const result = await new ClearTransportLogUseCase().execute();

    expect(dbRepo.delete).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT_LOG);
    expect(result).toEqual(true);
  });
});
