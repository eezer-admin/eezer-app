import { User } from '@interfaces/User';

export type AuthContextData = {
  login(username: string, password: string): Promise<User>;
  logout(): Promise<void>;
  isLoggedIn(): boolean;
  loggedIn: boolean;
  authLoaded: boolean;
  user: User | null | undefined;
};
