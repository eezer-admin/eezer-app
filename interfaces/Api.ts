export type LoginResponse = {
  token: string;
  data: GetUserResponse;
};

export type GetUserResponse = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  vehicles: [
    {
      id: number;
      name: string;
    }
  ];
};
