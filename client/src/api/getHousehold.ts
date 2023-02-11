import { useQuery } from 'react-query';
import { Household } from '../utils/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { NotFoundError } from '../utils/errors';

function fetchHousehold({ queryKey }: { queryKey: any }): Promise<Household> {
  return new Promise((resolve, reject) => {
    const [_key] = queryKey;
    const docRef = doc(db, 'households', _key);

    getDoc(docRef).then((s) => {
      if (s.exists()) {
        resolve(s.data() as Household);
      } else {
        reject(new NotFoundError('Household not found'));
      }
    });
  });
}

export function useHouseholdQuery(id: string) {
  return useQuery<Household>(id, fetchHousehold);
}
