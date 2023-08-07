import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { MockDatabaseRepository, mockTransport } from '@tests/utils';
import { GetTransportUseCase } from '@usecases/transport/GetTransportUseCase';

describe('GetTransportUseCase', () => {
  const dbRepo = new MockDatabaseRepository();

  beforeEach(() => {
    jest.clearAllMocks();

    container.bind('DatabaseRepository', dbRepo);
  });

  it('retrieves the transport from the storage', async () => {
    jest.spyOn(dbRepo, 'get');

    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockTransport));

    const transport = await new GetTransportUseCase().execute();

    expect(dbRepo.get).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT);
    expect(transport).toEqual(mockTransport);
  });

  it('returns null if nothing is stored', async () => {
    jest.spyOn(dbRepo, 'get');

    (dbRepo.get as jest.Mock).mockResolvedValueOnce(null);

    const transport = await new GetTransportUseCase().execute();

    expect(dbRepo.get).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT);
    expect(transport).toEqual(null);
  });
});
