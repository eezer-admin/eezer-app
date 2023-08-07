import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { MockDatabaseRepository } from '@tests/utils';
import { ClearTransportUseCase } from '@usecases/transport/ClearTransportUseCase';

describe('ClearTransportUseCase', () => {
  const dbRepo = new MockDatabaseRepository();

  beforeEach(() => {
    jest.clearAllMocks();

    container.bind('DatabaseRepository', dbRepo);
  });

  it('deletes the transport from the storage', async () => {
    jest.spyOn(dbRepo, 'delete');

    (dbRepo.delete as jest.Mock).mockResolvedValueOnce(true);

    const result = await new ClearTransportUseCase().execute();

    expect(dbRepo.delete).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT);
    expect(result).toEqual(true);
  });
});
