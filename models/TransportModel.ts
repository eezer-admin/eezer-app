import { format } from 'date-fns';

import { __ } from '../localization/Localization';
import { formatDuration } from '../services/TimeService';
import { persist } from '../services/TransportService';
import { generateUuid } from '../services/UuidService';
import { ApiTransport, TransportCoordinate } from '../types/Transports';

type TransportData = {
  id: number | null;
  identifier: string;
  started: string | null; // Timestamp.
  ended: string | null; // Timestamp.
  durationSeconds: number;
  distanceMeters: number;
  reason: string;
  coordinates: TransportCoordinate[];
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

  addCoordinates(coordinates: TransportCoordinate): TransportModel {
    if (!this.isOngoing()) {
      return this;
    }

    if (this.data.coordinates) {
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
    return 'to be implemented';
  }

  getReadableStartDate(): string {
    if (!this.data.started) {
      return '';
    }

    return format(new Date(this.data.started), 'yyyy.MM.dd');
  }

  toApiFormat(userId: number): ApiTransport {
    return {
      started: this.data.started || '',
      ended: this.data.ended || '',
      duration: this.getReadableDuration(),
      distance: 'string', // Todo: implement
      reason: 'string', // Todo: implement
      coordinates: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Move',
              coordTimes: this.data.coordinates?.map((coordinate: TransportCoordinate) => {
                return coordinate.timestamp;
              }),
            },
            geometry: {
              type: 'LineString',
              coordinates: this.data.coordinates?.map((coordinate: TransportCoordinate) => {
                return [coordinate.latitude, coordinate.longitude, coordinate.altitude];
              }),
            },
          },
        ],
      },
      vehicle_id: 1,
      user_id: userId,
    } as ApiTransport;
  }
}
