import { BackendRepository } from '@interfaces/BackendRepository';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';
import { GetUserUseCase } from '@usecases/user/GetUserUseCase';

import { GetLocalTransportLogUseCase } from './GetLocalTransportLogUseCase';
import { SortTransportLogUseCase } from './SortTransportLogUseCase';

export class GetFullTransportLogUseCase {
  private backendRepository: BackendRepository;

  constructor() {
    this.backendRepository = container.resolve('BackendRepository');
  }

  async execute(): Promise<Transport[]> {
    const user = await new GetUserUseCase().execute();

    if (!user) {
      return [];
    }

    let log = [] as Transport[];
    let apiTransports = [] as Transport[];

    try {
      apiTransports = await this.backendRepository.getUserTransports(user);
    } catch (err) {
      //
    }

    const localTransports = await new GetLocalTransportLogUseCase().execute();

    log = log.concat(apiTransports);
    log = log.concat(localTransports);
    log = log.filter((transport: Transport) => transport.started);

    return new SortTransportLogUseCase().execute(log);
  }
}
