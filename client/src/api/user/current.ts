import { useMutation } from 'react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { User } from '../../utils/types';

function getUserData(uid: string): Promise<User> {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, 'users', uid);
      const user = await getDoc(docRef);
      if (!user.exists()) {
        reject({ message: "user doesn't exist" });
        return;
      }
      resolve(user.data() as any);
    } catch (e: any) {
      reject({ message: e.message });
    }
  });
}

export default function useGetUserDataQuery() {
  return useMutation(getUserData);
}
