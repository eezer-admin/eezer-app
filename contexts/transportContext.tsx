import { Transport } from '@src/domain/entities/Transport';
import { GetTransportUseCase } from '@usecases/transport/GetTransportUseCase';
import { createContext, useEffect, useState } from 'react';

import { TransportContextData } from '@interfaces/Transport';

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

  return (
    <TransportContext.Provider
      value={{
        transport,
        setTransport,
      }}>
      {props.children}
    </TransportContext.Provider>
  );
};
