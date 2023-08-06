import { UserData, Vehicle } from '@interfaces/User';

export class User {
  private id: number;
  private first_name: string | null;
  private last_name: string | null;
  private email: string;
  private phone: string | null;
  public access_token: string;
  private vehicles: Vehicle[];

  constructor(data: UserData) {
    this.id = data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.email = data.email;
    this.phone = data.phone || null;
    this.access_token = data.access_token;
    this.vehicles = data.vehicles || [];
  }
}
