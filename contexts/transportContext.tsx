import { createContext, useEffect, useState } from 'react';

import TransportModel from '../models/TransportModel';
import { get as getFromStorage, persist, remove } from '../services/TransportService';
import { TransportContextData } from '../types/Transports';

export const TransportContext = createContext<TransportContextData>({} as TransportContextData);

export const TransportProvider = (props) => {
  const [data, setData] = useState<TransportContextData>();

  useEffect(() => {
    getFromStorage().then((transport: TransportModel) => {
      if (transport) {
        setData(transport);
      }
    });
  }, []);

  const get = async (): Promise<TransportModel | null> => {
    return getFromStorage();
  };

  const start = async (reason: string, vehicle_id: number): Promise<TransportModel> => {
    const transport = new TransportModel(null);
    transport.start(reason);
    transport.setVehicleId(vehicle_id);
    setData(transport);

    return persist(transport);
  };

  const completeTransport = async (): Promise<void> => {
    setData(null);

    return remove();
  };

  const save = async (transport: TransportModel): Promise<TransportModel> => {
    return persist(transport).then(() => {
      setData(transport);

      return transport;
    });
  };

  return (
    <TransportContext.Provider
      value={{
        data,
        get,
        save,
        start,
        completeTransport,
      }}>
      {props.children}
    </TransportContext.Provider>
  );
};
