import { BackendRepository } from '@interfaces/BackendRepository';
import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { GetBackendTransport } from '@interfaces/Transport';
import { TRANSPORT_REASON } from '@src/Constants';
import { Transport } from '@src/domain/entities/Transport';
import { User } from '@src/domain/entities/User';

export class MockBackendRepository implements BackendRepository {
  async login(email: string, password: string, deviceName: string): Promise<User> {
    return Promise.resolve(mockUser);
  }

  async getUserTransports(user: User): Promise<Transport[]> {
    return Promise.resolve(mockUserTransportsApiResponse.data.map((transport: any) => new Transport(transport)));
  }

  async postUserTransports(user: User, transports: Transport[]): Promise<Transport[]> {
    return Promise.resolve(mockUserTransportsApiResponse.data.map((transport: any) => new Transport(transport)));
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

export const mockUser = new User({
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'johndoe@example.org',
  phone: '1234567890',
  access_token: 'testToken',
});

export const mockTransport = new Transport({
  started: new Date().toISOString(),
  ended: null,
  durationSeconds: null,
  distance: null,
  reason: TRANSPORT_REASON.DELIVERY,
  vehicle_id: null,
});

export const mockLoginApiResponse = {
  data: {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@example.org',
    phone: '1234567890',
  },
  token: 'testToken',
};

export const mockUserTransportsApiResponse = {
  data: [
    {
      id: 1,
      started_at: '2023-01-01T10:00:00.000Z',
      ended_at: '2023-01-01T11:00:00.000Z',
      distance_meters: 5012,
      reason: TRANSPORT_REASON.DELIVERY,
    },
    {
      id: 2,
      started_at: '2023-01-02T10:30:00.000Z',
      ended_at: '2023-01-02T11:05:00.000Z',
      distance_meters: 1100,
      reason: TRANSPORT_REASON.SICKNESS,
    },
  ],
};

export const mockMappedUserApiTransports = mockUserTransportsApiResponse.data.map((transport: GetBackendTransport) =>
  new Transport().fromApiFormat(transport)
);
