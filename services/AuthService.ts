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

export function storeUser(user: User): Promise<User> {
  return AsyncStorage.setItem(storageKey, JSON.stringify(user)).then(() => {
    return user;
  });
}
