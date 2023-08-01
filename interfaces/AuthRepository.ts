import { User } from '@src/domain/entities/User';

export interface AuthRepository {
  login(email: string, password: string, deviceName: string): Promise<User>;
}
