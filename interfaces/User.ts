export type User = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  access_token: string;
  vehicles: [
    {
      id: number;
      name: string;
    }
  ];
};
