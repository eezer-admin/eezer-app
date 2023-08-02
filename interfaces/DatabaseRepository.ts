export interface DatabaseRepository {
  store(key: string, value: string | object | any[]): Promise<boolean>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<boolean>;
}
