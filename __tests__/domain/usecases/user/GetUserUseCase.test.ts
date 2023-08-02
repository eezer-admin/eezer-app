import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { MockDatabaseRepository, mockUser } from '@tests/utils';
import { GetUserUseCase } from '@usecases/user/GetUserUseCase';

describe('GetUserUseCase', () => {
  const dbRepo = new MockDatabaseRepository();

  beforeEach(() => {
    jest.clearAllMocks();

    container.bind('DatabaseRepository', dbRepo);
  });

  it('retrieves the user from the storage', async () => {
    jest.spyOn(dbRepo, 'get');

    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUser));

    const user = await new GetUserUseCase().execute();

    expect(dbRepo.get).toHaveBeenCalledWith(STORAGE_KEYS.USER);
    expect(user).toEqual(mockUser);
  });

  it('returns null if nothing is stored', async () => {
    jest.spyOn(dbRepo, 'get');

    (dbRepo.get as jest.Mock).mockResolvedValueOnce(null);

    const user = await new GetUserUseCase().execute();

    expect(dbRepo.get).toHaveBeenCalledWith(STORAGE_KEYS.USER);
    expect(user).toEqual(null);
  });
});
