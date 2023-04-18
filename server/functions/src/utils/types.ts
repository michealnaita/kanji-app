export type HouseholdMember = {
  id: string;
  firstname: string;
  phone: number;
};
export interface HouseholdSlim {
  name: string;
  id: string;
  service: string;
  promo?: boolean;
}
export interface Household extends HouseholdSlim {
  price: number;
  service_membership: string;
  logins?: {
    email: string;
    password: string;
  };
  members: HouseholdMember[];
  status: 'active' | 'inactive';
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
  notifications: UserNotification[];
  services: Service[];
  transactions: UserTransaction[];
};
export type UserNotification = { message: string; at: string };
export type UserTransaction = {
  amount: number;
  action: 'service-payment' | 'balance-top-up';
  at: string;
};
export type Service = {
  id: 'netflix' | 'spotify';
  price: number;
  renewal: string;
  status: 'pending' | 'active';
  at: string;
  membership: string;
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
export type Promo = {
  slots: number;
  expired: boolean;
  household: HouseholdSlim;
  users: string[];
};
export type FunctionResponse<
  T = {
    [key: string]: any;
  }
> = {
  status: 'fail' | 'success';
  data?: T;
  error?: {
    message?: string;
    code: string;
  };
};
