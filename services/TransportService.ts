import AsyncStorage from '@react-native-async-storage/async-storage';

import { EezerClient } from '../clients';
import { Transport } from '../types/Transports';

const storageKey = 'EEZER::TRANSPORT';

export async function get(): Promise<Transport> {
  return AsyncStorage.getItem(storageKey).then((transport: string | null) => {
    if (transport) {
      return JSON.parse(transport);
    }
  });
}

export function persist(transport: Transport): Promise<Transport> {
  return AsyncStorage.setItem(storageKey, JSON.stringify(transport)).then(() => {
    return transport;
  });
}

export function remove(): Promise<void> {
  return AsyncStorage.removeItem(storageKey);
}
