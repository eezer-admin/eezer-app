import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosRequestHeaders } from 'axios';

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

  public async getTransports(): Promise {
    const headers = await this.getAuthenticatedHeaders();

    return await axios.get(`${this.baseUrl}/api/v1/transport/`, {
      headers,
    });
  }

  public async syncTransports(transports: ApiTransport[]): Promise<boolean> {
    const headers = await this.getAuthenticatedHeaders();
    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/transport/`, transports, {
        headers,
      });

      return !!response.data?.success;
    } catch (err) {
      console.log(err.response);
      return false;
    }
  }

  protected async getAuthenticatedHeaders(): Promise<AxiosRequestHeaders> {
    const token = await this.getAccessToken();

    return {
      Accept: 'applicaton/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  protected async getAccessToken(): Promise<string> {
    return AsyncStorage.getItem('EEZER::USER').then((user) => {
      if (user) {
        return JSON.parse(user).access_token;
      }
    });
  }
}
