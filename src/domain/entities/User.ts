export class User {
  constructor(
    public readonly id: string,
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly access_token: string
  ) {}
}
