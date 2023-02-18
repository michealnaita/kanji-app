export type HouseholdMember = {
  id: string;
  firstname: string;
  phone: number;
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
  households: HouseholdSlim[];
  current_amount: number;
  reserved?: number;
};

export type Transaction = {
  user_uid: string;
  amount: number;
  fulfilled: boolean;
};

export type PaymentRequestData = {
  amount?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export type FlutterwaveResponse = {
  status: string;
  message: string;
  data: {
    link: string;
  };
};

export type FunctionResponse = {
  status: 'fail' | 'success';
  data?: {
    [key: string]: any;
  };
  error?: {
    message?: string;
    code: string;
  };
};
