export type Transport = {
  identifier: string;
  isSynced: boolean;
  started: string; // Timestamp.
  ended: string | null; // Timestamp.
  duration: string;
  durationSeconds: number;
  distance: string;
  distanceMeters: number;
  reason: string;
};

export type TransportLog = Transport[];

export type TransportContextData = {
  data: Transport | null | undefined;
  get(): Promise<Transport | null>;
  start(reason: string): Promise<Transport>;
  stop(): Promise<Transport>;
  complete(): Promise<void>;
};

export type TransportLogContextData = {
  data: TransportLog;
};
