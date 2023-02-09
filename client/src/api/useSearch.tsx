import { useQuery } from 'react-query';
import { Household } from '../utils/types';

function fetchHouseholds(): Promise<Household[]> {
  const data = [
    {
      id: '12345678',
      name: 'The lules',
      service: 'netflix',
      price: 13000,
      service_type: 'Netflix(Premium)',
      persons: 3,
    },
    {
      id: '12345678',
      name: 'The kimeras',
      service: 'spotify',
      price: 12000,
      service_type: 'Spotify(Premium)',
      persons: 2,
    },
  ];
  return new Promise((resolve, reject) => {
    // setTimeout(() => reject(new Error('could not get households')), 3000);
    resolve([...data, ...data, ...data, ...data, ...data, ...data]);
  });
}
export default function useSearch() {
  return useQuery<Household[]>('search', fetchHouseholds);
}
