import { Transport } from '@src/domain/entities/Transport';

import { ClearTransportUseCase } from './ClearTransportUseCase';
import { GetLocalTransportLogUseCase } from './GetLocalTransportLogUseCase';
import { StoreTransportLogUseCase } from './StoreTransportLogUseCase';

export class StopTransportUseCase {
  async execute(transport: Transport): Promise<Transport> {
    // End the transport.
    transport.ended = new Date().toISOString();

    // Add the transport to the history log.
    const log = await new GetLocalTransportLogUseCase().execute();
    log.unshift(transport);

    // Persist the log and remove the current transport from local storage, making room for a new one.
    await new StoreTransportLogUseCase().execute(log);
    await new ClearTransportUseCase().execute();

    return transport;
  }
}
