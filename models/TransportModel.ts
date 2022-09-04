import { format, parse, parseISO } from 'date-fns';
import getDistance from 'geolib/es/getPreciseDistance';

import { formatDuration } from '../services/TimeService';
import { generateUuid } from '../services/UuidService';
import { ApiTransport, TransportCoordinate } from '../types/Transports';

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

interface Transport {
  data: TransportData;
  isOngoing(): boolean;
  isNotOngoing(): boolean;
  isStarted(): boolean;
  isEnded(): boolean;
  isSynced(): boolean;
  isNotSynced(): boolean;
  start(reason: string): TransportModel;
  stop(): TransportModel;
  setVehicleId(vehicleId: number): TransportModel;
  addCoordinates(coordinates: TransportCoordinate): TransportModel;
  getReadableStartDate(): string;
  getReadableDuration(): string;
  getReadableDistance(): string;
}

export default class TransportModel implements Transport {
  data = {
    id: null,
    identifier: generateUuid(),
    started: null,
    ended: null,
    durationSeconds: 0,
    distanceMeters: 0,
    reason: '',
    coordinates: [],
    vehicle_id: null,
  };

  constructor(data: TransportData | null) {
    if (data) {
      this.data = data;
    }
  }

  isOngoing(): boolean {
    return !this.data.ended && !!this.data.started;
  }

  isNotOngoing(): boolean {
    return !!this.data.ended || !this.data.started;
  }

  isEnded(): boolean {
    return !!this.data.ended;
  }

  isStarted(): boolean {
    return !!this.data.started;
  }

  isSynced(): boolean {
    return !!this.data.id;
  }

  isNotSynced(): boolean {
    return !this.isSynced();
  }

  start(reason: string): TransportModel {
    this.data.started = new Date().toISOString();
    this.data.reason = reason;

    return this;
  }

  stop(): TransportModel {
    this.data.ended = new Date().toISOString();

    return this;
  }

  setVehicleId(vehicleId: number): TransportModel {
    this.data.vehicle_id = vehicleId;

    return this;
  }

  addCoordinates(coordinates: TransportCoordinate): TransportModel {
    if (!this.isOngoing()) {
      return this;
    }

    if (this.data.coordinates) {
      const previousLocation = this.data.coordinates[this.data.coordinates.length - 1];
      try {
        this.data.distanceMeters += getDistance(previousLocation, coordinates);
      } catch (err) {
        console.warn('Unable to get distance.', err);
      }

      this.data.coordinates.push(coordinates);
    } else {
      this.data.coordinates = [coordinates];
    }

    return this;
  }

  getReadableDuration(): string {
    if (this.isStarted() && this.isEnded()) {
      return formatDuration(this.data.started, this.data.ended);
    }
    if (!this.isStarted() && !this.isEnded()) {
      return '00:00';
    }

    return formatDuration(this.data.started, new Date().toISOString());
  }

  getReadableDistance(): string {
    if (this.data.distance) {
      return this.data.distance;
    }

    if (this.data.distanceMeters < 1000) {
      return `${this.data.distanceMeters} m`;
    }

    return `${Math.round((this.data.distanceMeters / 1000) * 100) / 100} km`;
  }

  getReadableStartDate(): string {
    if (!this.data.started) {
      return '';
    }

    try {
      return format(parseISO(this.data.started), 'yyyy.MM.dd');
    } catch (err) {
      return '-';
    }
  }

  getStartDateAsDateFormat(): Date | null {
    if (!this.data.started) {
      return null;
    }

    return new Date(parseISO(this.data.started));
  }

  toApiFormat(): ApiTransport {
    return {
      vehicle_id: this.data.vehicle_id,
      started_at: this.data.started || '',
      ended_at: this.data.ended || '',
      distance_meters: this.data.distanceMeters,
      reason: this.data.reason,
      coordinates: this.data.coordinates?.map((coordinate: TransportCoordinate) => {
        return {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          altitude: coordinate.altitude,
          logged_at: coordinate.timestamp,
        };
      }),
    } as ApiTransport;
  }

  fromApiFormat(apiTransport: ApiTransport): TransportModel {
    this.data = {
      id: apiTransport.id,
      identifier: null,
      started: apiTransport.started_at,
      ended: apiTransport.ended_at,
      durationSeconds: null,
      distanceMeters: apiTransport.distance_meters,
      distance: null,
      reason: apiTransport.reason,
      coordinates: [],
    } as TransportData;

    return this;
  }
}
