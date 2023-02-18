import { User } from '../../utils/types';
import { useMutation } from 'react-query';
import { db } from '../../utils/firebase';
import { formatErrorMessage } from '../../utils/errors';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type RequestData = { uid: string; household: string };
function leaveHouse({ uid, household }: RequestData) {
  return new Promise(async (resolve, reject) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) throw new Error('User doesnt exist');
      let { households } = userDoc.data() as User;
      households = households.filter((h) => h.id !== household);
      await setDoc(userDocRef, { ...userDoc.data(), households });
      resolve(true);
    } catch (e: any) {
      reject(new Error(formatErrorMessage(e.message)));
    }
  });
}
export default function useLeaveHouseholdMutation() {
  return useMutation(leaveHouse);
}
