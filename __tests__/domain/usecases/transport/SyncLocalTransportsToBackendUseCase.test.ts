import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { Transport } from '@src/domain/entities/Transport';
import { MockBackendRepository, MockDatabaseRepository, mockUser } from '@tests/utils';
import { SyncLocalTransportsToBackendUseCase } from '@usecases/transport/SyncLocalTransportsToBackendUseCase';

describe('SyncLocalTransportsToBackendUseCase', () => {
  const dbRepo = new MockDatabaseRepository();
  const backendRepo = new MockBackendRepository();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(dbRepo, 'get');
    jest.spyOn(dbRepo, 'delete');
    jest.spyOn(backendRepo, 'postUserTransports');

    container.bind('DatabaseRepository', dbRepo);
    container.bind('BackendRepository', backendRepo);
  });

  it('returns null if logged in user is not available', async () => {
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(null);

    const result = await new SyncLocalTransportsToBackendUseCase().execute();

    expect(result).toEqual(null);
    expect(backendRepo.postUserTransports).not.toHaveBeenCalled();
  });

  it('returns null if there are no transports to sync', async () => {
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUser));
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));

    const result = await new SyncLocalTransportsToBackendUseCase().execute();

    expect(result).toEqual(null);
    expect(backendRepo.postUserTransports).not.toHaveBeenCalled();
  });

  it('returns null if only synced transports are available', async () => {
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUser));
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([new Transport({ id: 1 }), new Transport({ id: 2 })])
    );

    const result = await new SyncLocalTransportsToBackendUseCase().execute();

    expect(result).toEqual(null);
    expect(backendRepo.postUserTransports).not.toHaveBeenCalled();
  });

  it('posts the transports to the backend correctly', async () => {
    const transport = new Transport({ id: null, started: '2023-01-01T10:00:00.000Z' });
    const user = mockUser;
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(user));
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify([transport]));
    (backendRepo.postUserTransports as jest.Mock).mockResolvedValueOnce([]);

    await new SyncLocalTransportsToBackendUseCase().execute();

    expect(backendRepo.postUserTransports).toHaveBeenCalledWith(user, [transport]);
  });

  it('clears the current log from the local storage', async () => {
    const transport = new Transport({ id: null, started: '2023-01-01T10:00:00.000Z' });
    const user = mockUser;
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(user));
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify([transport]));
    (dbRepo.delete as jest.Mock).mockResolvedValueOnce(true);

    await new SyncLocalTransportsToBackendUseCase().execute();

    expect(dbRepo.delete).toHaveBeenCalledWith(STORAGE_KEYS.TRANSPORT_LOG);
  });

  it('returns the full list of transports', async () => {
    const transport = new Transport({ id: null, started: '2023-01-01T10:00:00.000Z' });
    const user = mockUser;
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(user));
    (dbRepo.get as jest.Mock).mockResolvedValueOnce(JSON.stringify([transport]));
    (backendRepo.postUserTransports as jest.Mock).mockResolvedValueOnce([transport]);

    const result = await new SyncLocalTransportsToBackendUseCase().execute();

    expect(result).toEqual([transport]);
  });
});
