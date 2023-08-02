import { AuthRepository } from '@interfaces/AuthRepository';
import { ERROR_CODES } from '@src/Constants';
import { User } from '@src/domain/entities/User';
import fetch from 'node-fetch';

export class ApiAuthRepository implements AuthRepository {
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

    const response = await rawResponse.json();

    return new User(
      response.data.id,
      response.data.first_name,
      response.data.last_name,
      response.data.email,
      response.data.phone,
      response.token
    );
  }
}
