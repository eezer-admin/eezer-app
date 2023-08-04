import { createContext, useState } from 'react';

import TransportModel from '../models/TransportModel';
import {
  getFromApi,
  getFromStorage,
  removeFromStorage,
  syncLocalTransports as syncTransports,
} from '../services/TransportLogService';
import { TransportLog, TransportLogContextData } from '../types/Transports';

export const TransportLogContext = createContext<TransportLogContextData>({} as TransportLogContextData);

export const TransportLogProvider = (props) => {
  const [data, setData] = useState<TransportLogContextData>();

  const refresh = async (): Promise<void> => {
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

  // const add = async (transport: TransportModel): Promise<void> => {
  //   return addToLog(transport).then((log: TransportLog) => {
  //     if (data) {
  //       data.unshift(transport);
  //       setData(data);
  //     } else {
  //       setData([transport]);
  //     }
  //   });
  // };

  const syncLocalTransports = async (): Promise<void> => {
    const localTransports = data?.filter((transport: TransportModel) => transport.isNotSynced());

    if (localTransports.length === 0) {
      return new Promise(() => {});
    }

    syncTransports(localTransports).then((response: TransportLog) => {
      if (response) {
        removeFromStorage().then(() => {
          setData(sortLog(response));
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
        // add,
        syncLocalTransports,
      }}>
      {props.children}
    </TransportLogContext.Provider>
  );
};
