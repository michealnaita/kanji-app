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
  service: 'netflix' | 'spotify';
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
  notifications: UserNotification[];
  services: Service[];
  transactions: UserTransaction[];
  balance: number;
  roles: ('admin' | 'user')[];
};
export type UserNotification = { message: string; at: string };
export type UserTransaction = {
  amount: number;
  action: 'service-payment' | 'balance-top-up';
  at: string;
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

export type AddServiceData = {
  transactions: User['transactions'];
  notifications: User['notifications'];
  current_amount: number;
  services: User['services'];
};

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

export type Admin = {
  pending_requests: {
    uid: string;
    email: string;
    name: string;
    service: 'spotify' | 'netflix';
    at: string;
  }[];
  users_count: number;
  active_services: {
    uid: string;
    email: string;
    service: string;
    renewal: string;
  }[];
  houses: {
    email: string;
    id: string;
    capacity: number;
    service: 'spotify' | 'netflix';
  }[];
};

export type House = {
  label: string;
  email: string;
  members: HouseMember[];
  link: string;
  address: string;
  service: 'spotify' | 'netflix';
};
export type HouseMember = {
  email: string;
  uid: string;
  name: string;
};

export type Service = {
  id: 'netflix' | 'spotify';
  price: number;
  renewal: string;
  status: 'pending' | 'active';
  at: string;
  membership: string;
  house?: string;
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

export type Promo = {
  slots: number;
  expired: boolean;
  household: HouseholdSlim;
  users: string[];
};
