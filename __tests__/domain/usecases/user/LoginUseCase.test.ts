import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { container } from '@src/di/Container';
import { MockAuthRepository, MockDatabaseRepository, mockUser } from '@tests/utils';
import { LoginUseCase } from '@usecases/user/LoginUseCase';

describe('LoginUseCase', () => {
  const authRepo = new MockAuthRepository();
  const dbRepo = new MockDatabaseRepository();

  beforeEach(() => {
    jest.clearAllMocks();

    container.bind('AuthRepository', authRepo);
    container.bind('DatabaseRepository', dbRepo);
  });

  it('retrieves the user from the api', async () => {
    jest.spyOn(authRepo, 'login');

    await new LoginUseCase().execute('test@example.org', 'password');

    expect(authRepo.login).toHaveBeenCalledWith('test@example.org', 'password', 'mock');
  });

  it('stores the user in the local storage', async () => {
    jest.spyOn(dbRepo, 'store');

    await new LoginUseCase().execute('test@example.org', 'password');

    expect(dbRepo.store).toHaveBeenCalledWith('USER', mockUser);
  });

  it('returns the logged in user', async () => {
    const user = await new LoginUseCase().execute('test@example.org', 'password');

    expect(user).toEqual(mockUser);
  });
});
