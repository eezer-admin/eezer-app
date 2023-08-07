import { describe, expect, it } from '@jest/globals';
import { formatDuration, uuid } from '@src/Utils';

describe('Utils', () => {
  describe('uuid', () => {
    it('returns a valid uuid', () => {
      const value = uuid();

      expect(value).toHaveLength(36);
    });
  });

  describe('formatDuration', () => {
    it('returns the correct duration', () => {
      expect(formatDuration('2023-01-01T10:00:00.000Z', '2023-01-01T11:30:50.000Z')).toEqual('01:30:50');
    });
  });
});
