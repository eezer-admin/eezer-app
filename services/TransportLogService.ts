import AsyncStorage from '@react-native-async-storage/async-storage';

import { EezerClient } from '../clients';
import TransportModel from '../models/TransportModel';
import { TransportLog } from '../types/Transports';
import { getUserId } from './AuthService';

const storageKey = 'EEZER::TRANSPORT_LOG';

export async function get(): Promise<TransportLog> {
  return AsyncStorage.getItem(storageKey).then((log: string | null) => {
    if (log) {
      return JSON.parse(log).map((item) => {
        return new TransportModel(item.data);
      });
    }
  });
}

export function add(transport: TransportModel): Promise<TransportLog> {
  return get().then((log: TransportLog) => {
    let data = log;
    if (data) {
      data.unshift(transport);
    } else {
      data = [transport];
    }

    console.log('Adding to log!', data);

    return persist(data);
  });
}

export function persist(log: TransportLog): Promise<TransportLog> {
  return AsyncStorage.setItem(storageKey, JSON.stringify(log)).then(() => {
    return log;
  });
}

export function remove(): Promise<void> {
  return AsyncStorage.removeItem(storageKey);
}

export async function syncLocalTransports(transports: TransportLog): Promise<TransportLog> {
  const userId = await getUserId();
  const localTransports = transports.map((transport: TransportModel) => {
    return transport.toApiFormat(userId);
  });

  console.log(localTransports);

  const eezerClient = new EezerClient();
  const response = await eezerClient.syncTransports(localTransports);

  console.log('Got response from the client!', response);
}
