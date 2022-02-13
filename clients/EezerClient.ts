import axios from 'axios';

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
    // TODO: change email.
    const response = await axios.get(`${this.baseUrl}/api/v1/users/mattias@happypixels.se`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
}
