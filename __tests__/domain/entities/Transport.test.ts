import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { TRANSPORT_REASON } from '@src/Constants';
import { Transport } from '@src/domain/entities/Transport';

describe('Transport', () => {
  beforeAll(() => {
    jest.setSystemTime(new Date('2023-01-01T10:00:00.000Z'));
  });

  describe('isOngoing', () => {
    it('returns true if the transport is ongoing', () => {
      const transport = new Transport({ started: new Date().toISOString(), ended: null });

      expect(transport.isOngoing()).toBe(true);
    });

    it('returns false if the transport has ended', () => {
      const transport = new Transport({ started: new Date().toISOString(), ended: new Date().toISOString() });

      expect(transport.isOngoing()).toBe(false);
    });
  });

  describe('isNotOngoing', () => {
    it('returns true if the transport is not ongoing', () => {
      const transport = new Transport({ started: new Date().toISOString(), ended: new Date().toISOString() });

      expect(transport.isNotOngoing()).toBe(true);
    });

    it('returns false if the transport is ongoing', () => {
      const transport = new Transport({ started: new Date().toISOString(), ended: null });

      expect(transport.isNotOngoing()).toBe(false);
    });
  });

  describe('isEnded', () => {
    it('returns true if the transport has ended', () => {
      const transport = new Transport({ started: new Date().toISOString(), ended: new Date().toISOString() });

      expect(transport.isEnded()).toBe(true);
    });

    it('returns false if the transport has not ended', () => {
      const transport = new Transport({ started: new Date().toISOString(), ended: null });

      expect(transport.isEnded()).toBe(false);
    });
  });

  describe('isStarted', () => {
    it('returns true if the transport has started', () => {
      const transport = new Transport({ started: new Date().toISOString(), ended: null });

      expect(transport.isStarted()).toBe(true);
    });

    it('returns false if the transport has not started', () => {
      const transport = new Transport();

      expect(transport.isStarted()).toBe(false);
    });
  });

  describe('isSynced', () => {
    it('returns true if the transport is synced', () => {
      const transport = new Transport();
      transport.id = 1;

      expect(transport.isSynced()).toBe(true);
    });

    it('returns false if the transport is not synced yet', () => {
      const transport = new Transport();

      expect(transport.isSynced()).toBe(false);
    });
  });

  describe('isNotSynced', () => {
    it('returns true if the transport is not synced yet', () => {
      const transport = new Transport();

      expect(transport.isNotSynced()).toBe(true);
    });

    it('returns false if the transport is synced', () => {
      const transport = new Transport();
      transport.id = 1;

      expect(transport.isNotSynced()).toBe(false);
    });
  });

  describe('getReadableDuration', () => {
    it('returns formatted duration when the transport is finished', () => {
      const transport = new Transport({ started: '2023-01-01T10:00:00.000Z', ended: '2023-01-01T12:33:25.000Z' });

      expect(transport.getReadableDuration()).toBe('02:33:25');
    });

    it('returns formatted duration when the transport is started', () => {
      const transport = new Transport({ started: '2023-01-01T09:15:10.000Z', ended: null });

      expect(transport.getReadableDuration()).toBe('00:44:50');
    });

    it('returns default when the transport has not started yet', () => {
      const transport = new Transport({ started: null, ended: null });

      expect(transport.getReadableDuration()).toBe('00:00');
    });
  });

  describe('getReadableDistance', () => {
    it('returns meters when less than a km', () => {
      const transport = new Transport({ distanceMeters: 500 });

      expect(transport.getReadableDistance()).toBe('500 m');
    });

    it('returns kms when longer than a km', () => {
      const transport = new Transport({ distanceMeters: 5530 });

      expect(transport.getReadableDistance()).toBe('5.53 km');
    });
  });

  describe('getReadableStartDate', () => {
    it('returns a readable start date', () => {
      const transport = new Transport({ started: '2023-01-01T10:00:00.000Z' });

      expect(transport.getReadableStartDate()).toBe('2023.01.01');
    });

    it('returns a dash if unable to parse the start date', () => {
      const transport = new Transport({ started: 'invalid date' });

      expect(transport.getReadableStartDate()).toBe('-');
    });
  });

  describe('toApiFormat', () => {
    it('maps the transport to the API format', () => {
      const transport = new Transport({
        id: 1,
        vehicleId: 1,
        started: '2023-01-01T10:00:00.000Z',
        ended: '2023-01-01T12:33:25.000Z',
        distanceMeters: 5530,
        reason: TRANSPORT_REASON.DELIVERY,
        coordinates: [{ latitude: 1, longitude: 2, altitude: 3, timestamp: '2023-01-01T10:00:00.000Z' }],
      });

      expect(transport.toApiFormat()).toEqual({
        id: 1,
        vehicle_id: 1,
        started_at: '2023-01-01T10:00:00.000Z',
        ended_at: '2023-01-01T12:33:25.000Z',
        distance_meters: 5530,
        reason: TRANSPORT_REASON.DELIVERY,
        coordinates: [{ latitude: 1, longitude: 2, altitude: 3, logged_at: '2023-01-01T10:00:00.000Z' }],
      });
    });
  });

  describe('fromApiFormat', () => {
    it('maps the transport from the API format', () => {
      const transport = new Transport().fromApiFormat({
        id: 1,
        started_at: '2023-01-01T10:00:00.000Z',
        ended_at: '2023-01-01T12:33:25.000Z',
        distance_meters: 5530,
        reason: TRANSPORT_REASON.DELIVERY,
      });

      expect(transport.id).toBe(1);
      expect(transport.started).toBe('2023-01-01T10:00:00.000Z');
      expect(transport.ended).toBe('2023-01-01T12:33:25.000Z');
      expect(transport.distanceMeters).toBe(5530);
      expect(transport.reason).toBe(TRANSPORT_REASON.DELIVERY);
    });
  });
});
