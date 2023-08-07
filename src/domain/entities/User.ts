import { UserData, Vehicle } from '@interfaces/User';

export class User {
  public id: number;
  public first_name: string | null;
  public last_name: string | null;
  public email: string;
  public phone: string | null;
  public access_token: string;
  public vehicles: Vehicle[];

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
