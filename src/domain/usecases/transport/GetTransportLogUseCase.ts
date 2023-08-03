import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';

export class GetTransportLogUseCase {
  private databaseRepository: DatabaseRepository;

  constructor() {
    this.databaseRepository = container.resolve('DatabaseRepository');
  }

  async execute(): Promise<Transport[]> {
    const log = await this.databaseRepository.get(STORAGE_KEYS.TRANSPORT_LOG);

    if (!log) {
      return [];
    }

    const parsedLog = JSON.parse(log) as Transport[];

    return parsedLog
      .map((transportData) => {
        return new Transport(transportData);
      })
      .filter((transport: Transport) => {
        return transport.getStartDateAsDateFormat() !== null;
      })
      .sort((a: Transport, b: Transport) => b.getStartDateAsDateFormat() - a.getStartDateAsDateFormat());
  }
}
