import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { MockDatabaseRepository } from '@tests/utils';
import { ClearUserUseCase } from '@usecases/user/ClearUserUseCase';

describe('DeleteUserUseCase', () => {
  const dbRepo = new MockDatabaseRepository();

  beforeEach(() => {
    jest.clearAllMocks();

    container.bind('DatabaseRepository', dbRepo);
  });

  it('deletes the user from the storage', async () => {
    jest.spyOn(dbRepo, 'delete');

    (dbRepo.delete as jest.Mock).mockResolvedValueOnce(true);

    const result = await new ClearUserUseCase().execute();

    expect(dbRepo.delete).toHaveBeenCalledWith(STORAGE_KEYS.USER);
    expect(result).toEqual(true);
  });
});
