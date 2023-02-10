export type HouseholdMember = {
  id: string;
  firstname: string;
  phone: number;
};
export type SignInData = { email: string; password: string };
export type RegisterData = {
  email: string;
  password: string;
  confirm_password: string;
  phone: number;
  firstname: string;
  lastname: string;
};
export interface HouseholdSlim {
  name: string;
  id: string;
  service: string;
}
export interface Household extends HouseholdSlim {
  price: number;
  persons: number;
  service_type: string;
  logins?: {
    email: string;
    password: string;
  };
  members: HouseholdMember[];
}
