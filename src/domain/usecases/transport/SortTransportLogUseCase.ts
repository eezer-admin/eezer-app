import { Transport } from '@src/domain/entities/Transport';

export class SortTransportLogUseCase {
  execute(log: Transport[]): Transport[] {
    return log
      .filter((transport: Transport) => {
        return transport.getStartDateAsDateFormat() !== null;
      })
      .sort((a: Transport, b: Transport) => {
        // Null start dates are already removed by the filter above.
        return (
          (b.getStartDateAsDateFormat()?.getTime() ?? 0) -
          (a.getStartDateAsDateFormat()?.getTime() ?? 0)
        );
      });
  }
}
