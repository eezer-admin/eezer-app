import { describe, expect, it } from '@jest/globals';
import { User } from '@src/domain/entities/User';

describe('User', () => {
  it('returns true if the transport is ongoing', () => {
    const user = new User({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.org',
      phone: '123456789',
      access_token: 'testToken',
      vehicles: [{ id: 1, name: 'Test vehicle' }],
    });

    expect(user.id).toBe(1);
    expect(user.first_name).toBe('John');
    expect(user.last_name).toBe('Doe');
    expect(user.email).toBe('john.doe@example.org');
    expect(user.phone).toBe('123456789');
    expect(user.access_token).toBe('testToken');
    expect(user.vehicles).toEqual([{ id: 1, name: 'Test vehicle' }]);
  });

  it('it sets fallbacks', () => {
    const user = new User({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.org',
      access_token: 'testToken',
    });

    expect(user.phone).toBe(null);
    expect(user.vehicles).toEqual([]);
  });
});
