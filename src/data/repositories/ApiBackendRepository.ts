import type { paths } from '@fender/eezer-backend-eezer-api';
import { BackendRepository } from '@interfaces/BackendRepository';
import { ERROR_CODES } from '@src/Constants';
import { Transport } from '@src/domain/entities/Transport';
import { User } from '@src/domain/entities/User';
import fetch from 'node-fetch';

export class ApiBackendRepository implements BackendRepository {
  private readonly baseUrl = 'https://eezer.happypixels.se';

  async login(email: string, password: string, deviceName: string): Promise<User> {
    const rawResponse = await fetch(`${this.baseUrl}/api/v1/login`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        device_name: deviceName,
      }),
    });

    if (!rawResponse.ok) {
      throw new Error(ERROR_CODES.LOGIN_FAILED, rawResponse as ErrorOptions);
    }

    const response =
      (await rawResponse.json()) as paths['/api/v1/login']['post']['responses']['200']['content']['application/json'];

    return new User({
      id: response.data.id || 0,
      first_name: response.data.first_name || null,
      last_name: response.data.last_name || null,
      email: response.data.email || '',
      phone: response.data.phone || null,
      access_token: response.token,
    });
  }

  async getUserTransports(user: User): Promise<Transport[]> {
    const rawResponse = await fetch(`${this.baseUrl}/api/v1/user/transports`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.access_token}`,
      },
    });

    if (!rawResponse.ok) {
      throw new Error(ERROR_CODES.FAILED_GETTING_USER_TRANSPORTS, rawResponse as ErrorOptions);
    }

    const response =
      (await rawResponse.json()) as paths['/api/v1/user/transports']['get']['responses']['200']['content']['application/json'];

    return response.data.map((transport) => {
      return new Transport().fromApiFormat(transport);
    });
  }

  async postUserTransports(user: User, transports: Transport[]): Promise<Transport[]> {
    const body: paths['/api/v1/user/transports']['post']['requestBody']['content']['application/json'] =
      {
        data: transports.map((transport) => transport.toApiFormat()),
      };

    const rawResponse = await fetch(`${this.baseUrl}/api/v1/user/transports`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.access_token}`,
      },
      body: JSON.stringify(body),
    });

    if (!rawResponse.ok) {
      throw new Error(ERROR_CODES.FAILED_SYNCING_USER_TRANSPORTS, rawResponse as ErrorOptions);
    }

    const response =
      (await rawResponse.json()) as paths['/api/v1/user/transports']['post']['responses']['200']['content']['application/json'];

    return response.data.map((transport) => {
      return new Transport().fromApiFormat(transport);
    });
  }
}
