import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageDatabaseRepository implements DatabaseRepository {
  private readonly storageKeyPrefix = 'EEZER::';

  async store(key: string, value: string | object | any[]): Promise<boolean> {
    await AsyncStorage.setItem(this.storageKeyPrefix + key, JSON.stringify(value));

    return true;
  }

  async get(key: string): Promise<string | null> {
    const data = await AsyncStorage.getItem(this.storageKeyPrefix + key);

    return data || null;
  }

  async delete(key: string): Promise<boolean> {
    await AsyncStorage.removeItem(this.storageKeyPrefix + key);

    return true;
  }
}
