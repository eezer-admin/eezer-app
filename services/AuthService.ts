import AsyncStorage from '@react-native-async-storage/async-storage';

import { EezerClient, LoginResponse } from '../clients';
import { User } from '../types/Auth';

const storageKey = 'EEZER::USER';

export async function requestLogin(username: string, password: string): Promise<User | null> {
  const eezerClient = new EezerClient();

  return eezerClient.login(username, password).then((response: LoginResponse) => {
    return storeUser({
      id: response.data.id,
      first_name: response.data.first_name,
      last_name: response.data.last_name,
      email: response.data.email,
      phone: response.data.phone,
      access_token: response.token,
      vehicles: response.data.vehicles,
    });
  });
}

export async function getStoredUser(): Promise<User> {
  return AsyncStorage.getItem(storageKey).then((user) => {
    if (user) {
      return JSON.parse(user);
    }
  });
}

export function storeUser(user: User): Promise<User> {
  return AsyncStorage.setItem(storageKey, JSON.stringify(user)).then(() => {
    return user;
  });
}

export async function deleteStoredUser(): Promise<void> {
  return AsyncStorage.removeItem(storageKey);
}

export async function getUserId(): Promise<number> {
  return AsyncStorage.getItem(storageKey).then((user) => {
    if (user) {
      return JSON.parse(user).id;
    }
  });
}
