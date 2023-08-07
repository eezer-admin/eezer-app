import { BackendRepository } from '@interfaces/BackendRepository';
import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { ApiBackendRepository } from '@repositories/ApiBackendRepository';
import { AsyncStorageDatabaseRepository } from '@repositories/AsyncStorageDatabaseRepository';

class Container {
  private instances = new Map();

  bind<T>(abstract: string, implementation: T) {
    this.instances.set(abstract, implementation);
  }

  resolve<T>(key: string): T {
    return this.instances.get(key);
  }

  register(): void {
    this.bind<DatabaseRepository>('DatabaseRepository', new AsyncStorageDatabaseRepository());
    this.bind<BackendRepository>('BackendRepository', new ApiBackendRepository());
  }
}

export const container = new Container();
