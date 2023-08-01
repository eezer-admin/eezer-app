import { AuthRepository } from '@interfaces/AuthRepository';
import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { ApiAuthRepository } from '@repositories/ApiAuthRepository';
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
    this.bind<AuthRepository>('AuthRepository', new ApiAuthRepository());
  }
}

export const container = new Container();
