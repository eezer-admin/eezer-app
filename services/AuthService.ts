import AsyncStorage from '@react-native-async-storage/async-storage';

import { EezerClient, GetUserResponse, LoginResponse } from '../clients';
import { User } from '../types/Auth';

const storageKey = 'EEZER::USER';

export async function requestLogin(username: string, password: string): Promise<User> {
  const eezerClient = new EezerClient();

  return eezerClient.login(username, password).then((response: LoginResponse) => {
    return eezerClient.getUser(response.access_token).then((userResponse: GetUserResponse): Promise<User> => {
      return storeUser({
        id: userResponse.id,
        first_name: userResponse.first_name,
        last_name: userResponse.last_name,
        email: userResponse.email,
        phone: userResponse.phone,
        access_token: response.access_token,
      });
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

export async function getAccessToken(): Promise<string> {
  return AsyncStorage.getItem(storageKey).then((user) => {
    if (user) {
      return JSON.parse(user).access_token;
    }
  });
}

export async function getUserId(): Promise<number> {
  return AsyncStorage.getItem(storageKey).then((user) => {
    if (user) {
      return JSON.parse(user).id;
    }
  });
}
