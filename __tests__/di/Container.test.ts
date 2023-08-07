import { describe, expect, it } from '@jest/globals';
import { ApiBackendRepository } from '@repositories/ApiBackendRepository';
import { AsyncStorageDatabaseRepository } from '@repositories/AsyncStorageDatabaseRepository';
import { container } from '@src/di/Container';

describe('Container', () => {
  it('binds the correct implementations', async () => {
    container.register();

    expect(container.resolve('DatabaseRepository')).toBeInstanceOf(AsyncStorageDatabaseRepository);
    expect(container.resolve('BackendRepository')).toBeInstanceOf(ApiBackendRepository);
  });
});
