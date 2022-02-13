import { createContext, useEffect, useState } from 'react';

import { add, get as getFromStorage } from '../services/TransportLogService';
import { TransportLog, TransportLogContextData } from '../types/Transports';

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

  return <TransportLogContext.Provider value={[data, setData]}>{props.children}</TransportLogContext.Provider>;
};
