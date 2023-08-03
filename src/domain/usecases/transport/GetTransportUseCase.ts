import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';

export class GetTransportUseCase {
  private databaseRepository: DatabaseRepository;

  constructor() {
    this.databaseRepository = container.resolve('DatabaseRepository');
  }

  async execute(): Promise<Transport | null> {
    const transport = await this.databaseRepository.get(STORAGE_KEYS.TRANSPORT);

    return transport ? (JSON.parse(transport) as Transport) : null;
  }
}
