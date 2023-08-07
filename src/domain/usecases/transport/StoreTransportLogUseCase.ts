import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';

import { SortTransportLogUseCase } from './SortTransportLogUseCase';

export class StoreTransportLogUseCase {
  private databaseRepository: DatabaseRepository;

  constructor() {
    this.databaseRepository = container.resolve('DatabaseRepository');
  }

  async execute(log: Transport[]): Promise<boolean> {
    // Sort the log before storing it.
    log = new SortTransportLogUseCase().execute(log);

    return await this.databaseRepository.store(STORAGE_KEYS.TRANSPORT_LOG, log);
  }
}
