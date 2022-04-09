import { createContext, useEffect, useState } from 'react';

import TransportModel from '../models/TransportModel';
import {
  getFromStorage,
  syncLocalTransports as syncTransports,
  removeFromStorage,
  add as addToLog,
  getFromApi,
} from '../services/TransportLogService';
import { TransportLog, TransportLogContextData } from '../types/Transports';

export const TransportLogContext = createContext<TransportLogContextData>({} as TransportLogContextData);

export const TransportLogProvider = (props) => {
  const [data, setData] = useState<TransportLogContextData>();

  const refresh = async (): Promise<void> => {
    console.log('Refreshing log');
    let log = [] as TransportLog;
    const apiTransports = await getFromApi();
    const localTransports = await getFromStorage();

    if (apiTransports) {
      log = log.concat(apiTransports);
    }

    if (localTransports) {
      log = log.concat(localTransports);
    }

    setData(sortLog(log));
  };

  const add = async (transport: TransportModel): Promise<void> => {
    return addToLog(transport).then((log: TransportLog) => {
      if (data) {
        data.unshift(transport);
        setData(data);
      } else {
        setData([transport]);
      }
    });
  };

  const syncLocalTransports = async (): Promise<void> => {
    const localTransports = data?.filter((transport: TransportModel) => transport.isNotSynced());

    if (localTransports.length === 0) {
      return new Promise(() => {});
    }

    syncTransports(localTransports).then((success) => {
      if (success) {
        removeFromStorage().then(() => {
          refresh();
        });
      }
    });
  };

  const sortLog = (log: TransportLog): TransportLog => {
    return log.sort(
      (a: TransportModel, b: TransportModel) => b.getStartDateAsDateFormat() - a.getStartDateAsDateFormat()
    );
  };

  return (
    <TransportLogContext.Provider
      value={{
        data,
        refresh,
        add,
        syncLocalTransports,
      }}>
      {props.children}
    </TransportLogContext.Provider>
  );
};
