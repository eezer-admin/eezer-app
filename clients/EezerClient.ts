import axios, { AxiosRequestHeaders } from 'axios';

import { getAccessToken } from '../services/AuthService';
import { ApiTransport } from '../types/Transports';

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type GetUserResponse = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
};

export class EezerClient {
  baseUrl = 'https://api.eezer.dev.sdnit.se';

  public async login(username: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/login/access-token`,
      `username=${username}&password=${password}`,
      {
        headers: { Accept: 'application/x-www-form-urlencoded' },
      }
    );

    return response.data;
  }

  public async getUser(token: string): Promise<GetUserResponse> {
    const response = await axios.get(`${this.baseUrl}/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  public async syncTransports(transports: ApiTransport[]): Promise {
    const headers = await this.getAuthenticatedHeaders();

    console.log({
      headers,
    });

    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/transport`, transports, {
        headers,
      });

      console.log('Response from API:', response.data);

      return response.data;
    } catch (err) {
      console.log(err.response);
    }
  }

  protected async getAuthenticatedHeaders(): Promise<AxiosRequestHeaders> {
    const token = await getAccessToken();

    return {
      Accept: 'applicaton/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }
}
