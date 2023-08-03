import { createContext, useEffect, useState } from 'react';

import { Transport } from '@src/domain/entities/Transport';
import { GetTransportUseCase } from '@usecases/transport/GetTransportUseCase';
import TransportModel from '../models/TransportModel';
import { get as getFromStorage, persist, remove } from '../services/TransportService';
import { TransportContextData } from '../types/Transports';

export const TransportContext = createContext<TransportContextData>({} as TransportContextData);

export const TransportProvider = (props) => {
  const [data, setData] = useState<TransportContextData>();
  const [transport, setTransport] = useState<Transport | null>(null);

  // Check if the user already has an ongoing transport in the local storage
  // when opening the app. If so, navigate directly to it.
  useEffect(() => {
    new GetTransportUseCase().execute().then((transport: Transport | null) => {
      if (transport) {
        setData(transport);
        setTransport(transport);
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
        transport,
        setTransport,
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
