import { TransportContextData } from '@interfaces/Transport';
import { Transport } from '@src/domain/entities/Transport';
import { ClearTransportUseCase } from '@usecases/transport/ClearTransportUseCase';
import { GetTransportUseCase } from '@usecases/transport/GetTransportUseCase';
import { SyncLocalTransportsToBackendUseCase } from '@usecases/transport/SyncLocalTransportsToBackendUseCase';
import * as Network from 'expo-network';
import { createContext, useEffect, useState } from 'react';

export const TransportContext = createContext<TransportContextData>({} as TransportContextData);

export const TransportProvider = (props) => {
  const [transport, setTransport] = useState<Transport>(new Transport());
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

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

  // When the internet is reachable, upload local transports to the backend.
  const uploadTransportsIfConnectedToNetwork = async (): Promise<void> => {
    if (!isConnected) {
      console.log('Internet is not reachable, skipping upload of local transports to the backend.');

      return;
    }

    console.log('Internet is reachable, uploading local transports to the backend.');

    new SyncLocalTransportsToBackendUseCase().execute();
  };

  useEffect(() => {
    // Initial network check
    const checkInitialNetwork = async () => {
      const { isInternetReachable } = await Network.getNetworkStateAsync();
      setIsConnected(isInternetReachable || null);
    };

    checkInitialNetwork();

    // Listen for network changes
    const subscription = Network.addNetworkStateListener(
      ({ type, isConnected, isInternetReachable }) => {
        setIsConnected(isInternetReachable || null);
      }
    );

    // Cleanup listener on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  // When the network becomes accessible, upload any unsynced transports.
  useEffect(() => {
    if (isConnected) {
      uploadTransportsIfConnectedToNetwork();
    }
  }, [isConnected]);

  return (
    <TransportContext.Provider
      value={{
        transport,
        setTransport,
        resetTransport,
        uploadTransportsIfConnectedToNetwork,
      }}>
      {props.children}
    </TransportContext.Provider>
  );
};
