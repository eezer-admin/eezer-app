import {
  GetBackendTransport,
  NewTransportData,
  PostBackendTransport,
  TransportCoordinate,
} from '@interfaces/Transport';
import { formatDuration, uuid } from '@src/Utils';
import { format, parseISO } from 'date-fns';

export class Transport {
  public id: number | null;
  public identifier: string | null;
  public started: string | null; // Timestamp.
  public ended: string | null; // Timestamp.
  public durationSeconds: number;
  public distanceMeters: number;
  public distance: string | null;
  public reason: string | null;
  public coordinates: TransportCoordinate[];
  public vehicleId: number | null;

  constructor(data: NewTransportData = {}) {
    this.id = data.id || null;
    this.identifier = data.identifier || uuid();
    this.started = data.started || null;
    this.ended = data.ended || null;
    this.durationSeconds = data.durationSeconds || 0;
    this.distanceMeters = data.distanceMeters || 0;
    this.distance = data.distance || '0 m';
    this.reason = data.reason || null;
    this.coordinates = data.coordinates || [];
    this.vehicleId = data.vehicleId || null;
  }

  isOngoing(): boolean {
    return !this.ended && !!this.started;
  }

  isNotOngoing(): boolean {
    return !!this.ended || !this.started;
  }

  isEnded(): boolean {
    return !!this.ended;
  }

  isStarted(): boolean {
    return !!this.started;
  }

  isSynced(): boolean {
    return this.id !== null;
  }

  isNotSynced(): boolean {
    return !this.isSynced();
  }

  getReadableDuration(): string {
    if (this.started && this.ended) {
      return formatDuration(this.started, this.ended);
    }
    if (!this.started) {
      return '00:00';
    }

    return formatDuration(this.started, new Date().toISOString());
  }

  getReadableDistance(): string {
    if (this.distanceMeters < 1000) {
      return `${this.distanceMeters} m`;
    }

    return `${Math.round((this.distanceMeters / 1000) * 100) / 100} km`;
  }

  getReadableStartDate(): string {
    if (!this.started) {
      return '';
    }

    try {
      return format(parseISO(this.started), 'yyyy.MM.dd');
    } catch (err) {
      return '-';
    }
  }

  getStartDateAsDateFormat(): Date | null {
    if (!this.started) {
      return null;
    }

    return new Date(parseISO(this.started));
  }

  toApiFormat(): PostBackendTransport {
    return {
      id: this.id,
      vehicle_id: this.vehicleId,
      started_at: this.started || '',
      ended_at: this.ended || '',
      distance_meters: this.distanceMeters,
      reason: this.reason,
      coordinates: this.coordinates.map((coordinate: TransportCoordinate) => {
        return {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          altitude: coordinate.altitude,
          logged_at: coordinate.timestamp,
        };
      }),
    } as PostBackendTransport;
  }

  fromApiFormat(data: GetBackendTransport): Transport {
    this.id = data.id;
    this.started = data.started_at;
    this.ended = data.ended_at;
    this.distanceMeters = data.distance_meters;
    this.reason = data.reason;

    return this;
  }
}
