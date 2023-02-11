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
  phone: string;
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
  service_membership: string;
  logins?: {
    email: string;
    password: string;
  };
  members: HouseholdMember[];
}
export type User = {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  households: Household[];
  current_amount: number;
};
