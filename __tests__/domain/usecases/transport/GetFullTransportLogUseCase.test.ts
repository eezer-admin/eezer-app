import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';
import { MockBackendRepository, MockDatabaseRepository, mockMappedUserApiTransports, mockUser } from '@tests/utils';
import { GetFullTransportLogUseCase } from '@usecases/transport/GetFullTransportLogUseCase';

describe('GetFullTransportLogUseCase', () => {
  const dbRepo = new MockDatabaseRepository();
  const backendRepo = new MockBackendRepository();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(dbRepo, 'get');
    jest.spyOn(backendRepo, 'getUserTransports');

    container.bind('DatabaseRepository', dbRepo);
    container.bind('BackendRepository', backendRepo);
  });

  it('returns an empty array if logged in user is not available', async () => {
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(null);

    const result = await new GetFullTransportLogUseCase().execute();

    expect(result).toEqual([]);
    expect(backendRepo.getUserTransports).not.toHaveBeenCalled();
  });

  it('fetches the transport log from the backend correctly', async () => {
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUser));

    await new GetFullTransportLogUseCase().execute();

    expect(backendRepo.getUserTransports).toHaveBeenCalledWith(mockUser);
  });

  it('ignores backend log if the request fails', async () => {
    (backendRepo.getUserTransports as jest.Mock).mockReturnValue(Promise.resolve(new Response('', { status: 403 })));
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUser));
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));

    const result = await new GetFullTransportLogUseCase().execute();

    expect(result).toEqual([]);
    expect(dbRepo.get).toHaveBeenCalledWith(STORAGE_KEYS.USER);
    expect(dbRepo.get).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT_LOG);
  });

  it('fetches the local transport log correctly', async () => {
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUser));
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([
        new Transport({ started: '2023-01-01T10:30:00.000Z' }),
        new Transport({ started: '2023-01-05T10:00:00.000Z' }),
      ])
    );

    const result = await new GetFullTransportLogUseCase().execute();

    expect(dbRepo.get).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT_LOG);
    expect(result[0].started).toEqual('2023-01-05T10:00:00.000Z');
    expect(result[1].started).toEqual('2023-01-01T10:30:00.000Z');
  });

  it('combines the two log sources and sorts the list by start date', async () => {
    (backendRepo.getUserTransports as jest.Mock).mockResolvedValueOnce(mockMappedUserApiTransports);
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUser));
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([
        new Transport({ started: '2023-01-01T10:30:00.000Z' }),
        new Transport({ started: '2023-01-05T10:00:00.000Z' }),
      ])
    );

    const result = await new GetFullTransportLogUseCase().execute();

    expect(result[0]).toBeInstanceOf(Transport);
    expect(result[1]).toBeInstanceOf(Transport);
    expect(result[2]).toBeInstanceOf(Transport);
    expect(result[3]).toBeInstanceOf(Transport);

    expect(result[0].started).toEqual('2023-01-05T10:00:00.000Z'); // From local storage.
    expect(result[1].started).toEqual('2023-01-02T10:30:00.000Z'); // From backend.
    expect(result[2].started).toEqual('2023-01-01T10:30:00.000Z'); // From local storage.
    expect(result[3].started).toEqual('2023-01-01T10:00:00.000Z'); // From backend.
  });
});
