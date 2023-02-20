import { collection, getDocs } from 'firebase/firestore';
import { useQuery } from 'react-query';
import { db } from '../utils/firebase';
import { Household } from '../utils/types';

function fetchHouseholds(): Promise<Household[]> {
  return new Promise((resolve, reject) => {
    getDocs(collection(db, 'households'))
      .then((q) => {
        const docs: Household[] = [];
        q.forEach((d) => docs.push({ id: d.id, ...d.data() } as Household));
        if (!docs.length)
          reject(new Error('There arent any households to show'));
        resolve(docs);
      })
      .catch((e) => reject(e));
  });
}
export default function useSearch() {
  return useQuery<Household[]>('search', fetchHouseholds);
}
