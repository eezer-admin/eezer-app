import { Transport } from '@src/domain/entities/Transport';

import { StoreTransportUseCase } from './StoreTransportUseCase';

export class StopTransportUseCase {
  async execute(transport: Transport): Promise<Transport> {
    transport.ended = new Date().toISOString();

    await new StoreTransportUseCase().execute(transport);

    return transport;
  }
}
