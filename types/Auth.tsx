import { User } from '@src/domain/entities/User';

export type AuthContextData = {
  login(username: string, password: string): Promise<User | null>;
  logout(): Promise<void>;
  isLoggedIn(): boolean;
  loggedIn: boolean;
  authLoaded: boolean;
  user: User | null | undefined;
};
