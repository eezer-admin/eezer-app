import { NewTransportData, TransportCoordinate } from '@interfaces/Transport';
import { uuid } from '@src/Utils';
import { format, formatDuration, parseISO } from 'date-fns';

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
    this.vehicleId = data.vehicle_id || null;
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
    return !!this.id;
  }

  isNotSynced(): boolean {
    return !this.isSynced();
  }

  setVehicleId(vehicleId: number): Transport {
    this.vehicleId = vehicleId;

    return this;
  }

  getReadableDuration(): string {
    if (this.isStarted() && this.isEnded()) {
      return formatDuration(this.started, this.ended);
    }
    if (!this.isStarted() && !this.isEnded()) {
      return '00:00';
    }

    return formatDuration(this.started, new Date().toISOString());
  }

  getReadableDistance(): string {
    if (this.distance) {
      return this.distance;
    }

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

  //   toApiFormat(): ApiTransport {
  //     return {
  //       vehicle_id: this.data.vehicle_id,
  //       started_at: this.data.started || '',
  //       ended_at: this.data.ended || '',
  //       distance_meters: this.data.distanceMeters,
  //       reason: this.data.reason,
  //       coordinates: this.data.coordinates?.map((coordinate: TransportCoordinate) => {
  //         return {
  //           latitude: coordinate.latitude,
  //           longitude: coordinate.longitude,
  //           altitude: coordinate.altitude,
  //           logged_at: coordinate.timestamp,
  //         };
  //       }),
  //     } as ApiTransport;
  //   }

  //   fromApiFormat(apiTransport: ApiTransport): TransportModel {
  //     this.data = {
  //       id: apiTransport.id,
  //       identifier: null,
  //       started: apiTransport.started_at,
  //       ended: apiTransport.ended_at,
  //       durationSeconds: null,
  //       distanceMeters: apiTransport.distance_meters,
  //       distance: null,
  //       reason: apiTransport.reason,
  //       coordinates: [],
  //     } as TransportData;

  //     return this;
  //   }
}
