import { Transport } from '@src/domain/entities/Transport';

export type TransportData = {
  id: number | null;
  identifier: string | null;
  started: string | null; // Timestamp.
  ended: string | null; // Timestamp.
  durationSeconds: number | null;
  distanceMeters: number;
  distance: string | null;
  reason: string;
  coordinates: TransportCoordinate[];
  vehicle_id: number | null;
};

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
  vehicle_id?: number | null;
};

export type TransportContextData = {
  transport: Transport | null;
  setTransport(transport: Transport): Promise<void>;
  completeTransport(): Promise<void>;
};
