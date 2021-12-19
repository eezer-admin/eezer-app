import { API_BASE_URL } from '@env'

interface ConfigInterface {
  api: {
    baseUrl: string;
  };
}

console.log(API_BASE_URL)

export const Config: ConfigInterface = {
  api: {
    baseUrl: <string>API_BASE_URL
  }
}
