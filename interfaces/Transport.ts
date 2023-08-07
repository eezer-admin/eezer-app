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
};

export type PostBackendTransport = {
  vehicle_id: number;
  started_at: string;
  ended_at: string;
  distance_meters: number;
  reason: string;
  passenger_name?: string;
  passenger_phone?: string;
  coordinates: {
    latitude: number;
    longitude: number;
    altitude?: number | null;
    logged_at: string;
  }[];
};

export type GetBackendTransport = {
  id: number;
  started_at: string;
  ended_at: string;
  distance_meters: number;
  reason: string;
};
