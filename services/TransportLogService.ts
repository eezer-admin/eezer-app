import AsyncStorage from '@react-native-async-storage/async-storage';

import { EezerClient } from '../clients';
import { Transport, TransportLog } from '../types/Transports';

const storageKey = 'EEZER::TRANSPORT_LOG';

export async function get(): Promise<TransportLog> {
  return AsyncStorage.getItem(storageKey).then((log: string | null) => {
    if (log) {
      return JSON.parse(log);
    }
  });
}

export function add(transport: Transport): Promise<TransportLog> {
  return get().then((log: TransportLog) => {
    console.log('Adding to the log', log);
    let data = log;
    if (data) {
      console.log('Found existing log', log);
      log.unshift(transport);
    } else {
      console.log('Creating new log');
      data = [transport];
    }

    return persist(log);
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
