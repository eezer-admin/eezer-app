import { describe, expect, it, jest } from '@jest/globals';
import { ApiBackendRepository } from '@repositories/ApiBackendRepository';
import { ERROR_CODES, TRANSPORT_REASON } from '@src/Constants';
import { Transport } from '@src/domain/entities/Transport';
import { mockLoginApiResponse, mockUser, mockUserTransportsApiResponse } from '@tests/utils';
import fetch from 'node-fetch';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('ApiBackendRepository', () => {
  describe('login', () => {
    it('calls the login endpoint', async () => {
      fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(mockLoginApiResponse))));

      const repo = new ApiBackendRepository();

      await repo.login('johndoe@example.org', 'password', 'My Device');

      expect(fetch).toHaveBeenCalledWith('https://eezer.happypixels.se/api/v1/login', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'johndoe@example.org',
          password: 'password',
          device_name: 'My Device',
        }),
      });
    });

    it('handles non successful responses', async () => {
      fetch.mockReturnValue(Promise.resolve(new Response('', { status: 422 })));

      try {
        const repo = new ApiBackendRepository();
        await repo.login('johndoe@example.org', 'password', 'My Device');
      } catch (err) {
        expect(err).toEqual(new Error('login_failed'));
      }
    });

    it('returns a user instance', async () => {
      fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(mockLoginApiResponse))));

      const repo = new ApiBackendRepository();

      const response = await repo.login('johndoe@example.org', 'password', 'My Device');

      expect(response).toEqual(mockUser);
    });
  });

  describe('getUserTransports', () => {
    it('calls the user transports endpoint correctly', async () => {
      fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(mockUserTransportsApiResponse))));

      const repo = new ApiBackendRepository();

      await repo.getUserTransports(mockUser);

      expect(fetch).toHaveBeenCalledWith('https://eezer.happypixels.se/api/v1/user/transports', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer testToken`,
        },
      });
    });

    it('returns a list of transports', async () => {
      fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(mockUserTransportsApiResponse))));

      const repo = new ApiBackendRepository();

      const response = await repo.getUserTransports(mockUser);

      expect(response).toHaveLength(2);
      expect(response[0]).toBeInstanceOf(Transport);
      expect(response[1]).toBeInstanceOf(Transport);
      expect(response[0].id).toEqual(1);
      expect(response[0].started).toEqual('2023-01-01T10:00:00.000Z');
      expect(response[0].ended).toEqual('2023-01-01T11:00:00.000Z');
      expect(response[0].distanceMeters).toEqual(5012);
      expect(response[0].reason).toEqual(TRANSPORT_REASON.DELIVERY);
    });

    it('handles non successful responses', async () => {
      fetch.mockReturnValue(Promise.resolve(new Response('', { status: 401 })));

      try {
        const repo = new ApiBackendRepository();
        await repo.getUserTransports(mockUser);
      } catch (err) {
        expect(err).toEqual(new Error(ERROR_CODES.FAILED_GETTING_USER_TRANSPORTS));
      }
    });
  });
});
