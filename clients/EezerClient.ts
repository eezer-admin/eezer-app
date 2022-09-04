import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosRequestHeaders } from 'axios';
import * as Device from 'expo-device';

import TransportModel from '../models/TransportModel';
import { ApiTransport, TransportLog } from '../types/Transports';

export type LoginResponse = {
  token: string;
  data: GetUserResponse;
};

export type GetUserResponse = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  vehicles: [
    {
      id: number;
      name: string;
    }
  ];
};

export class EezerClient {
  baseUrl = 'https://eezer.happypixels.se';

  public async login(username: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/login`,
      {
        email: username,
        password,
        device_name: Device.deviceName || Device.modelName || 'Unknown device',
      },
      { headers: this.getHeaders() }
    );

    return response.data;
  }

  public async getUser(token: string): Promise<GetUserResponse> {
    const response = await axios.get(`${this.baseUrl}/api/v1/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  public async getTransports(): Promise {
    const headers = await this.getAuthenticatedHeaders();
    const response = await axios.get(`${this.baseUrl}/api/v1/user/transports`, { headers });

    return response.data;
  }

  public async syncTransports(transports: ApiTransport[]): Promise<TransportLog> {
    const headers = await this.getAuthenticatedHeaders();
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/user/transports`,
        { data: transports },
        {
          headers,
        }
      );

      return response.data.data.map((transport) => {
        return new TransportModel(transport);
      });
    } catch (err) {
      console.log(err.response);
      return false;
    }
  }

  protected getHeaders(): AxiosRequestHeaders {
    return { Accept: 'application/json', 'Content-Type': 'application/json' };
  }

  protected async getAuthenticatedHeaders(): Promise<AxiosRequestHeaders> {
    const token = await this.getAccessToken();

    return {
      ...this.getHeaders(),
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
