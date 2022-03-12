import { createContext, useEffect, useState } from 'react';

import TransportModel from '../models/TransportModel';
import {
  get as getFromStorage,
  syncLocalTransports as syncTransports,
  remove,
  add as addToLog,
} from '../services/TransportLogService';
import { Transport, TransportLog, TransportLogContextData } from '../types/Transports';

export const TransportLogContext = createContext<TransportLogContextData>({} as TransportLogContextData);

export const TransportLogProvider = (props) => {
  const [data, setData] = useState<TransportLogContextData>();

  useEffect(() => {
    getFromStorage().then((log: TransportLog) => {
      if (log) {
        setData(log);
      }
    });
  }, []);

  const add = async (transport: TransportModel): Promise<void> => {
    return addToLog(transport).then((log: TransportLog) => {
      setData(log);
    });
  };

  const syncLocalTransports = async (): Promise<void> => {
    const localTransports = data?.filter((transport: TransportModel) => transport.isNotSynced());

    syncTransports(localTransports);
  };

  const clear = async (): Promise<void> => {
    setData(null);

    return remove();
  };

  return (
    <TransportLogContext.Provider
      value={{
        data,
        add,
        syncLocalTransports,
        clear,
      }}>
      {props.children}
    </TransportLogContext.Provider>
  );
};
