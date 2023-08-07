import { Transport } from '@src/domain/entities/Transport';

export class SortTransportLogUseCase {
  execute(log: Transport[]): Transport[] {
    return log
      .filter((transport: Transport) => {
        return transport.getStartDateAsDateFormat() !== null;
      })
      .sort((a: Transport, b: Transport) => b.getStartDateAsDateFormat() - a.getStartDateAsDateFormat());
  }
}
