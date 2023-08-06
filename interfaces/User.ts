import { User } from '@src/domain/entities/User';

export type Vehicle = {
  id: number;
  name: string;
};

export type UserData = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone?: string | null;
  access_token: string;
  vehicles?: Vehicle[];
};

export type AuthContextData = {
  login(username: string, password: string): Promise<User | null>;
  logout(): Promise<void>;
  isLoggedIn(): boolean;
  loggedIn: boolean;
  authLoaded: boolean;
  user: User | null | undefined;
};
