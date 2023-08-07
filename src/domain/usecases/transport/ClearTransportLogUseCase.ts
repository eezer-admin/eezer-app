import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';

export class ClearTransportLogUseCase {
  private databaseRepository: DatabaseRepository;

  constructor() {
    this.databaseRepository = container.resolve('DatabaseRepository');
  }

  async execute(): Promise<boolean> {
    const result = await this.databaseRepository.delete(STORAGE_KEYS.TRANSPORT_LOG);

    return result;
  }
}
