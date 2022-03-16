import AsyncStorage from '@react-native-async-storage/async-storage';

import TransportModel from '../models/TransportModel';

const storageKey = 'EEZER::TRANSPORT';

export async function get(): Promise<TransportModel> {
  return AsyncStorage.getItem(storageKey).then((transport: string | null) => {
    if (transport) {
      transport = JSON.parse(transport);

      return new TransportModel(transport?.data || transport);
    } else {
      return new TransportModel(null);
    }
  });
}

export function persist(transport: Transport): Promise<TransportModel> {
  return AsyncStorage.setItem(storageKey, JSON.stringify(transport)).then(() => {
    return transport;
  });
}

export function remove(): Promise<void> {
  return AsyncStorage.removeItem(storageKey);
}
