import { createContext, useEffect, useState } from 'react';

import { add } from '../services/TransportLogService';
import { get as getFromStorage, persist, remove, storeCurrentTransport } from '../services/TransportService';
import { generateUuid } from '../services/UuidService';
import { Transport, TransportContextData } from '../types/Transports';

export const TransportContext = createContext<TransportContextData>({} as TransportContextData);

export const TransportProvider = (props) => {
  const [data, setData] = useState<TransportContextData>();

  useEffect(() => {
    getFromStorage().then((transport: Transport) => {
      if (transport) {
        setData(transport);
      }
    });
  }, []);

  const get = async (): Promise<Transport | null> => {
    return getFromStorage();
  };

  const start = async (reason: string): Promise<Transport> => {
    const transport = {
      identifier: generateUuid(),
      started: new Date().toISOString(),
      ended: null,
      distanceMeters: 0,
      durationSeconds: 0,
      reason,
    } as Transport;

    return persist(transport);
  };

  const stop = async (): Promise<Transport> => {
    return get().then((transport: Transport | null) => {
      if (transport) {
        transport.ended = new Date().toISOString();

        return persist(transport);
      }
    });
  };

  /**
   * Adds the transport to the log and removes it from the ongoing transport context.
   */
  const complete = async (): Promise<void> => {
    return add(data as Transport).then(() => {
      console.log('Completed the transport!');
      return remove();
    });
  };

  return (
    <TransportContext.Provider
      value={{
        data,
        get,
        stop,
        start,
        complete,
      }}>
      {props.children}
    </TransportContext.Provider>
  );
};
