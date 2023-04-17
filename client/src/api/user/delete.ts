import { formatErrorMessage } from './../../utils/errors';
import { useMutation } from 'react-query';
import { getAuth } from 'firebase/auth';
import { functions } from '../../utils/firebase';
import { HttpsCallable, httpsCallable } from 'firebase/functions';
import { FunctionResponse } from '../../utils/types';
function handleDeleteUser(): Promise<boolean> {
  const auth = getAuth().currentUser;
  return new Promise((resolve, reject) => {
    if (auth == null) {
      reject(new Error('You must be signed in'));
      return;
    }
    const deleteAccount = httpsCallable<unknown, FunctionResponse>(
      functions,
      'deleteUserAccount'
    );
    deleteAccount()
      .then(({ data: { status } }) => {
        if (status == 'success') resolve(true);
      })
      .catch((e) => reject({ message: formatErrorMessage(e) }));
  });
}
export default function useDeleteUserMutation() {
  return useMutation(handleDeleteUser);
}
