import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';
import { MockDatabaseRepository } from '@tests/utils';
import { GetLocalTransportLogUseCase } from '@usecases/transport/GetLocalTransportLogUseCase';

describe('GetLocalTransportLogUseCase', () => {
  const dbRepo = new MockDatabaseRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(dbRepo, 'get');

    container.bind('DatabaseRepository', dbRepo);
  });

  it('returns an empty array if there is no log stored', async () => {
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(null);

    const result = await new GetLocalTransportLogUseCase().execute();

    expect(result).toEqual([]);
    expect(dbRepo.get).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT_LOG);
  });

  it('returns an empty array if just an empty string is stored', async () => {
    (dbRepo.get as jest.Mock).mockResolvedValueOnce('');

    const result = await new GetLocalTransportLogUseCase().execute();

    expect(result).toEqual([]);
    expect(dbRepo.get).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT_LOG);
  });

  it('returns a list of transport entities', async () => {
    const transport1 = new Transport({ started: '2023-01-02T10:00:00.000Z' });
    const transport2 = new Transport({ started: '2023-01-01T10:00:00.000Z' });

    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify([transport1, transport2]));

    const result = await new GetLocalTransportLogUseCase().execute();

    expect(result[0]).toBeInstanceOf(Transport);
    expect(result[1]).toBeInstanceOf(Transport);
  });

  it('sorts the list by start date', async () => {
    const transport1 = new Transport({ started: '2023-01-02T10:00:00.000Z' });
    const transport2 = new Transport({ started: '2023-01-05T10:15:00.000Z' });
    const transport3 = new Transport({ started: '2023-01-05T10:00:00.000Z' });

    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify([transport1, transport2, transport3]));

    const result = await new GetLocalTransportLogUseCase().execute();

    expect(result[0].identifier).toEqual(transport2.identifier);
    expect(result[1].identifier).toEqual(transport3.identifier);
    expect(result[2].identifier).toEqual(transport1.identifier);
  });
});
