import { describe, expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageDatabaseRepository } from '@repositories/AsyncStorageDatabaseRepository';
import { mockUser } from '@tests/utils';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('AsyncStorageDatabaseRepository', () => {
  it('stores a string value correctly', async () => {
    const repo = new AsyncStorageDatabaseRepository();

    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

    await repo.store('USER', 'value');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('EEZER::USER', JSON.stringify('value'));
  });

  it('stores an object value correctly', async () => {
    const repo = new AsyncStorageDatabaseRepository();

    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

    await repo.store('USER', mockUser);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('EEZER::USER', JSON.stringify(mockUser));
  });

  it('gets a value', async () => {
    const repo = new AsyncStorageDatabaseRepository();

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUser));
    const user = await repo.get('MOCK_USER');

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('EEZER::MOCK_USER');
    expect(user).toEqual(mockUser);
  });

  it('returns null if the value does not exist', async () => {
    const repo = new AsyncStorageDatabaseRepository();

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(undefined);
    const user = await repo.get('USER');

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('EEZER::USER');
    expect(user).toEqual(null);
  });

  it('deletes a value', async () => {
    const repo = new AsyncStorageDatabaseRepository();

    (AsyncStorage.removeItem as jest.Mock).mockResolvedValueOnce(undefined);

    await repo.delete('USER');

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('EEZER::USER');
  });
});
