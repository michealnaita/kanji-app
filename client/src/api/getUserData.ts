import { doc, getDoc } from 'firebase/firestore';
import { useQuery } from 'react-query';
import { db } from '../utils/firebase';

// TODO: change this to mutation
export function getUserData({ queryKey }: any) {
  const [_key] = queryKey;
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, 'users', _key);
      const dataSnap = await getDoc(docRef);
      if (dataSnap.exists()) {
        const { firstname, lastname } = dataSnap.data();
        resolve({
          ...dataSnap.data(),
          username: `${firstname}  ${lastname}`,
          id: _key,
        });
      } else {
        reject(new Error('user does not exist'));
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}
export default function useUserQuery(userId: string) {
  return useQuery(userId, getUserData);
}
