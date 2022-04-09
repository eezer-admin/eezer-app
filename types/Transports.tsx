import TransportModel, { Transport } from '../models/TransportModel';

export type TransportCoordinate = {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: string;
};

// The local transport object used in the app.
/**
export type Transport = {
  id: number | null;
  identifier: string;
  isSynced: boolean;
  started: string; // Timestamp.
  ended: string | null; // Timestamp.
  durationSeconds: number;
  distanceMeters: number;
  reason: string;
  coordinates: TransportCoordinate[];
};
**/
type ApiTransportFeature = {
  type: string;
  properties: {
    name: string;
    coordTimes: string[];
  };
  geometry: {
    type: string;
    coordinates: number[][];
  };
};

// The format of the transport when sent to or from the backend API.
export type ApiTransport = {
  started: string;
  ended: string;
  duration: string;
  distance: string;
  reason: string;
  coordinates: {
    type: string;
    features: ApiTransportFeature[];
  };
  vehicle_id: number;
  user_id: number;
};

export type TransportLog = TransportModel[];

export type TransportContextData = {
  data: TransportModel | null | undefined;
  get(): Promise<TransportModel | null>;
  save(transport: TransportModel): Promise<TransportModel>;
  start(reason: string): Promise<TransportModel>;
  completeTransport(): Promise<void>;
};

export type TransportLogContextData = {
  data: TransportLog;
  refresh(): void;
  add(transport: TransportModel): Promise<void>;
  syncLocalTransports(): Promise<void>;
};
