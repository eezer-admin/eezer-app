import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';

export class StoreTransportUseCase {
  private databaseRepository: DatabaseRepository;

  constructor() {
    this.databaseRepository = container.resolve('DatabaseRepository');
  }

  async execute(transport: Transport): Promise<boolean> {
    const result = await this.databaseRepository.store(STORAGE_KEYS.TRANSPORT, transport);

    return result;
  }
}
