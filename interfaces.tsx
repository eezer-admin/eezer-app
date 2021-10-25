export interface TransportDriver {
  name: String;
}

export interface TransportInterface {
  id: String,
  isUploaded: Boolean,
  departsAt: Date,
  distanceKm: Number,
  secondsElapsed: Number,
  cause: String,
  driver: TransportDriver,
  getReadableDate(): String
}

export interface UnmappedTransportInterface {
  date: string,
  distance: Number,
  time: Number,
  cause: String,
  driverName: String
}
