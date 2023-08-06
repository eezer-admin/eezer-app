import { BackendRepository } from '@interfaces/BackendRepository';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';
import { GetUserUseCase } from '@usecases/user/GetUserUseCase';

import { ClearTransportLogUseCase } from './ClearTransportLogUseCase';
import { GetLocalTransportLogUseCase } from './GetLocalTransportLogUseCase';
import { SortTransportLogUseCase } from './SortTransportLogUseCase';

export class SyncLocalTransportsToBackendUseCase {
  private backendRepository: BackendRepository;

  constructor() {
    this.backendRepository = container.resolve('BackendRepository');
  }

  async execute(): Promise<Transport[] | null> {
    const user = await new GetUserUseCase().execute();

    // Only sync transports that are not synced yet.
    const transports = (await new GetLocalTransportLogUseCase().execute()).filter((transport) =>
      transport.isNotSynced()
    );

    // If there are no transports to sync or no user, return null.
    if (transports.length === 0 || !user) {
      return Promise.resolve(null);
    }

    // Send the transports to the backend.
    let log = await this.backendRepository.postUserTransports(user, transports);
    log = new SortTransportLogUseCase().execute(log);

    // Clear the log from the local storage, as it should only contain unsynced transports.
    await new ClearTransportLogUseCase().execute();

    return log;
  }
}
