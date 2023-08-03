import { Transport } from '@src/domain/entities/Transport';

import { StoreTransportUseCase } from './StoreTransportUseCase';

export class StartTransportUseCase {
  async execute(transport: Transport, reason: string, vehicleId: number): Promise<Transport> {
    transport.started = new Date().toISOString();
    transport.reason = reason;
    transport.vehicleId = vehicleId;

    await new StoreTransportUseCase().execute(transport);

    return transport;
  }
}
