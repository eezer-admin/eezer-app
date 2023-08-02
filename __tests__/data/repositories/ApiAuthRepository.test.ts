import { describe, expect, it, jest } from '@jest/globals';
import { ApiAuthRepository } from '@repositories/ApiAuthRepository';
import { mockLoginApiResponse, mockUser } from '@tests/utils';
import fetch from 'node-fetch';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('ApiAuthRepository', () => {
  describe('login()', () => {
    it('calls the login endpoint', async () => {
      fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(mockLoginApiResponse))));

      const repo = new ApiAuthRepository();

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
        const repo = new ApiAuthRepository();
        await repo.login('johndoe@example.org', 'password', 'My Device');
      } catch (err) {
        expect(err).toEqual(new Error('login_failed'));
      }
    });

    it('returns a user instance', async () => {
      fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(mockLoginApiResponse))));

      const repo = new ApiAuthRepository();

      const response = await repo.login('johndoe@example.org', 'password', 'My Device');

      expect(response).toEqual(mockUser);
    });
  });
});
