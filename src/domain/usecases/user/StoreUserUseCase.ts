import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { User } from '@src/domain/entities/User';

export class StoreUserUseCase {
  private databaseRepository: DatabaseRepository;

  constructor() {
    this.databaseRepository = container.resolve('DatabaseRepository');
  }

  async execute(user: User): Promise<boolean> {
    const result = await this.databaseRepository.store(STORAGE_KEYS.USER, user);

    return result;
  }
}
