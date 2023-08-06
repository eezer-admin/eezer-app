import { Transport } from '@src/domain/entities/Transport';
import { User } from '@src/domain/entities/User';

export interface BackendRepository {
  login(email: string, password: string, deviceName: string): Promise<User>;
  getUserTransports(user: User): Promise<Transport[]>;
  postUserTransports(user: User, transports: Transport[]): Promise<Transport[]>;
}
