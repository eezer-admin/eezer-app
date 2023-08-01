export interface DatabaseRepository {
  store(key: string, value: string | object | any[]): Promise<boolean>;
  get(key: string): Promise<string | object | any[] | null>;
  delete(key: string): Promise<boolean>;
}
