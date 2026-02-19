export type Company = {
  id: number;
  name: string;
  registeredAt: string;
};

export type CompaniesApiResponse = {
  // assuming that when we actually get 200 response, we get success: true with data and api behaves rationally like that
  success: true;
  data: Company[];
  total: number;
};

export type User = {
  id: number;
  companyId: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

export type UsersApiResponse = {
  success: true;
  data: User[];
  total: number;
};
