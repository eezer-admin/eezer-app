import { TransportContextData } from '@interfaces/Transport';
import { Transport } from '@src/domain/entities/Transport';
import { ClearTransportUseCase } from '@usecases/transport/ClearTransportUseCase';
import { GetTransportUseCase } from '@usecases/transport/GetTransportUseCase';
import { createContext, useEffect, useState } from 'react';

export const TransportContext = createContext<TransportContextData>({} as TransportContextData);

export const TransportProvider = (props) => {
  const [transport, setTransport] = useState<Transport>(new Transport());

  // Check if the user already has an ongoing transport in the local storage
  // when opening the app. If so, navigate directly to it.
  useEffect(() => {
    new GetTransportUseCase().execute().then((transport: Transport | null) => {
      if (transport) {
        setTransport(transport);
      }
    });
  }, []);

  const resetTransport = async (): Promise<void> => {
    await new ClearTransportUseCase().execute();
    setTransport(new Transport());
  };

  return (
    <TransportContext.Provider
      value={{
        transport,
        setTransport,
        resetTransport,
      }}>
      {props.children}
    </TransportContext.Provider>
  );
};
