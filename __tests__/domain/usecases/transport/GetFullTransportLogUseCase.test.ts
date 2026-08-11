import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ERROR_CODES, STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';
import {
  MockBackendRepository,
  MockDatabaseRepository,
  mockMappedUserApiTransports,
  mockUser,
} from '@tests/utils';
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
    jest.mocked(dbRepo.get).mockResolvedValueOnce(null);

    const result = await new GetFullTransportLogUseCase().execute();

    expect(result).toEqual([]);
    expect(backendRepo.getUserTransports).not.toHaveBeenCalled();
  });

  it('fetches the transport log from the backend correctly', async () => {
    jest.mocked(dbRepo.get).mockResolvedValueOnce(JSON.stringify(mockUser));

    await new GetFullTransportLogUseCase().execute();

    expect(backendRepo.getUserTransports).toHaveBeenCalledWith(mockUser);
  });

  it('ignores backend log if the request fails', async () => {
    // The repository throws when the response is not ok, so a failing request rejects.
    jest
      .mocked(backendRepo.getUserTransports)
      .mockRejectedValue(new Error(ERROR_CODES.FAILED_GETTING_USER_TRANSPORTS));
    jest.mocked(dbRepo.get).mockResolvedValueOnce(JSON.stringify(mockUser));
    jest.mocked(dbRepo.get).mockResolvedValueOnce(JSON.stringify([]));

    const result = await new GetFullTransportLogUseCase().execute();

    expect(result).toEqual([]);
    expect(dbRepo.get).toHaveBeenCalledWith(STORAGE_KEYS.USER);
    expect(dbRepo.get).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT_LOG);
  });

  it('fetches the local transport log correctly', async () => {
    jest.mocked(dbRepo.get).mockResolvedValueOnce(JSON.stringify(mockUser));
    jest
      .mocked(dbRepo.get)
      .mockResolvedValueOnce(
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
    jest.mocked(backendRepo.getUserTransports).mockResolvedValueOnce(mockMappedUserApiTransports);
    jest.mocked(dbRepo.get).mockResolvedValueOnce(JSON.stringify(mockUser));
    jest
      .mocked(dbRepo.get)
      .mockResolvedValueOnce(
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
