import { useMutation } from 'react-query';
import { User } from '../../utils/types';

function getUserData(): Promise<User> {
  return new Promise(async (resolve, reject) => {
    try {
      setTimeout(
        () =>
          resolve({
            id: 'srjuiateg5034it8t5983um9w84t',
            transactions: [],
            current_amount: 10000,
            notifications: [],
            services: [],
            firstname: 'Guest',
            lastname: 'User',
            phone: 256782478394,
            email: 'guestuser@example.com',
            households: [],
            roles: [],
            balance: 0,
          }),
        3000
      );
    } catch (e: any) {
      reject({ message: e.message });
    }
  });
}

export default function useGetUserDataQuery() {
  return useMutation<User, { message: string }, string>(getUserData);
}
