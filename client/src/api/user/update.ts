import { useMutation } from 'react-query';
import { getAuth, updatePassword } from 'firebase/auth';
import { db } from '../../utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { UserProfileForm } from '../../components/profile';
import { formatErrorMessage } from '../../utils/errors';

function updateUser({
  phone,
  firstname,
  lastname,
  password,
}: UserProfileForm): Promise<{
  phone: number;
  firstname: string;
  lastname: string;
}> {
  const auth = getAuth().currentUser;
  return new Promise(async (res, rej) => {
    if (auth == null) {
      rej(new Error('You must be signed in'));
      return;
    }

    try {
      //update user password
      if (!!password) {
        await updatePassword(auth, password);
      }
      // update user data
      const path = 'users/' + auth.uid;
      const userRef = doc(db, path);
      await updateDoc(userRef, {
        phone,
        firstname,
        lastname,
      });
      res({ phone, firstname, lastname });
    } catch (e: any) {
      rej(new Error(formatErrorMessage(e.code)));
    }
  });
}
export default function useUpdateUserMutation() {
  return useMutation(updateUser);
}
