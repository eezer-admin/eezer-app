import { Transport } from '@src/domain/entities/Transport';

import { StoreTransportUseCase } from './StoreTransportUseCase';

export class StartTransportUseCase {
  async execute(transport: Transport): Promise<Transport> {
    transport.started = new Date().toISOString();

    await new StoreTransportUseCase().execute(transport);

    return transport;
  }
}
