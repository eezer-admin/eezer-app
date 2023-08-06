import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';

import { GetLocalTransportLogUseCase } from './GetLocalTransportLogUseCase';
import { StoreTransportLogUseCase } from './StoreTransportLogUseCase';

export class CompleteTransportUseCase {
  private databaseRepository: DatabaseRepository;

  constructor() {
    this.databaseRepository = container.resolve('DatabaseRepository');
  }

  async execute(transport: Transport): Promise<Transport[]> {
    const log = await new GetLocalTransportLogUseCase().execute();

    log.unshift(transport);

    // Persist the log and remove the current transport from local storage, making room for a new one.
    await new StoreTransportLogUseCase().execute(log);
    await this.databaseRepository.delete(STORAGE_KEYS.TRANSPORT);

    return log;
  }
}
