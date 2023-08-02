import { AuthRepository } from '@interfaces/AuthRepository';
import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { User } from '@src/domain/entities/User';

export class MockAuthRepository implements AuthRepository {
  async login(email: string, password: string, deviceName: string): Promise<User> {
    return Promise.resolve(mockUser);
  }
}

export class MockDatabaseRepository implements DatabaseRepository {
  async store(key: string, value: string | object | any[]): Promise<boolean> {
    return Promise.resolve(true);
  }

  async get(key: string): Promise<string | null> {
    return Promise.resolve(null);
  }

  async delete(key: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}

export const mockUser = new User('userId', 'John', 'Doe', 'johndoe@example.org', '1234567890', 'testToken');

export const mockLoginApiResponse = {
  data: {
    id: 'userId',
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@example.org',
    phone: '1234567890',
  },
  token: 'testToken',
};
