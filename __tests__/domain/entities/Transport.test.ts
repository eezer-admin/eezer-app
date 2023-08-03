import { beforeAll, describe, expect, it, jest } from '@jest/globals';
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
});
