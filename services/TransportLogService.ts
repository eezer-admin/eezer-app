import AsyncStorage from '@react-native-async-storage/async-storage';

import { EezerClient } from '../clients';
import TransportModel, { TransportData } from '../models/TransportModel';
import { ApiTransport, TransportCoordinate, TransportLog } from '../types/Transports';
import { getUserId } from './AuthService';

const storageKey = 'EEZER::TRANSPORT_LOG';

export async function getFromStorage(): Promise<TransportLog> {
  return AsyncStorage.getItem(storageKey).then((log: string | null) => {
    if (log) {
      return JSON.parse(log).map((item) => {
        return new TransportModel(item.data);
      });
    }
  });
}

export async function getFromApi(): Promise<TransportLog> {
  const eezerClient = new EezerClient();

  return eezerClient
    .getTransports()
    .then((response) => {
      return response.data.map((apiTransport: ApiTransport) => {
        return new TransportModel(null).fromApiFormat(apiTransport);
      });
    })
    .catch((err) => {
      console.log('Error!');
      console.log(err);
    });
}

export function add(transport: TransportModel): Promise<TransportLog> {
  return getFromStorage().then((log: TransportLog) => {
    let data = log;
    if (data) {
      data.unshift(transport);
    } else {
      data = [transport];
    }

    return persist(data);
  });
}

export function persist(log: TransportLog): Promise<TransportLog> {
  return AsyncStorage.setItem(storageKey, JSON.stringify(log)).then(() => {
    return log;
  });
}

export function removeFromStorage(): Promise<void> {
  return AsyncStorage.removeItem(storageKey);
}

export async function syncLocalTransports(transports: TransportLog): Promise<boolean> {
  const userId = await getUserId();
  const localTransports = transports.map((transport: TransportModel) => {
    return transport.toApiFormat(userId);
  });

  const eezerClient = new EezerClient();
  return await eezerClient.syncTransports(localTransports);
}
