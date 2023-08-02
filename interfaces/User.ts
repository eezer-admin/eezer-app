export type Vehicle = {
  id: number;
  name: string;
};

export type UserData = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone?: string | null;
  access_token: string;
  vehicles?: Vehicle[];
};
