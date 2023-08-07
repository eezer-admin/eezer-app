import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { container } from '@src/di/Container';
import { MockBackendRepository, MockDatabaseRepository, mockUser } from '@tests/utils';
import { LoginUseCase } from '@usecases/user/LoginUseCase';

describe('LoginUseCase', () => {
  const backendRepo = new MockBackendRepository();
  const dbRepo = new MockDatabaseRepository();

  beforeEach(() => {
    jest.clearAllMocks();

    container.bind('BackendRepository', backendRepo);
    container.bind('DatabaseRepository', dbRepo);
  });

  it('retrieves the user from the api', async () => {
    jest.spyOn(backendRepo, 'login');

    await new LoginUseCase().execute('test@example.org', 'password');

    expect(backendRepo.login).toHaveBeenCalledWith('test@example.org', 'password', 'mock');
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
