import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { User } from '@src/domain/entities/User';

export class GetUserUseCase {
  private databaseRepository: DatabaseRepository;

  constructor() {
    this.databaseRepository = container.resolve('DatabaseRepository');
  }

  async execute(): Promise<User | null> {
    const user = await this.databaseRepository.get(STORAGE_KEYS.USER);

    return user ? (JSON.parse(user) as User) : null;
  }
}
