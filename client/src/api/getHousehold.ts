import { useQuery } from 'react-query';
import { Household } from '../utils/types';

function fetchHousehold({ queryKey }: { queryKey: any }): Promise<Household> {
  const data: Household = {
    id: '12345678',
    name: 'The kimeras',
    service: 'spotify',
    price: 12000,
    service_type: 'Spotify(Premium)',
    persons: 2,
    members: [
      { id: '09uijwrksfli9w49worepf', firstname: 'John', phone: 2345678987 },
      { id: 'sfg9876werf54dgh', firstname: 'Ken', phone: 2345067890 },
    ],
    logins: {
      email: '*****@gmail.com',
      password: '12345',
    },
  };
  const _key = queryKey;
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(data), 3000);
  });
}

export function useHouseholdQuery(id: string) {
  return useQuery<Household>(id, fetchHousehold);
}
