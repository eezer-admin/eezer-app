import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { MockDatabaseRepository, mockUser } from '@tests/utils';
import { StoreUserUseCase } from '@usecases/user/StoreUserUseCase';

describe('StoreUserUseCase', () => {
  const dbRepo = new MockDatabaseRepository();

  beforeEach(() => {
    jest.clearAllMocks();

    container.bind('DatabaseRepository', dbRepo);
  });

  it('stores the user in the storage', async () => {
    jest.spyOn(dbRepo, 'store');

    (dbRepo.store as jest.Mock).mockResolvedValueOnce(true);

    const result = await new StoreUserUseCase().execute(mockUser);

    expect(dbRepo.store).toHaveBeenCalledWith(STORAGE_KEYS.USER, mockUser);
    expect(result).toEqual(true);
  });
});
