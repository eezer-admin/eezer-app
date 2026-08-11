import type { components } from '@fender/eezer-backend-eezer-api';
import { Transport } from '@src/domain/entities/Transport';

export type TransportCoordinate = {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: string;
};

export type NewTransportData = {
  id?: number | null;
  identifier?: string | null;
  started?: string | null; // Timestamp.
  ended?: string | null; // Timestamp.
  durationSeconds?: number | null;
  distanceMeters?: number;
  distance?: string | null;
  reason?: string;
  coordinates?: TransportCoordinate[];
  vehicleId?: number | null;
};

export type TransportContextData = {
  transport: Transport;
  setTransport: React.Dispatch<React.SetStateAction<Transport>>;
  resetTransport: () => Promise<void>;
  uploadTransportsIfConnectedToNetwork: () => Promise<void>;
};

export type PostBackendTransport = components['schemas']['TransportInput'];

export type GetBackendTransport = components['schemas']['Transport'];
