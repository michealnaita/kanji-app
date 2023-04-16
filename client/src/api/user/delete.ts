import { useMutation } from 'react-query';
import { getAuth } from 'firebase/auth';
function handleDeleteUser(): Promise<boolean> {
  const auth = getAuth().currentUser;
  return new Promise((resolve, reject) => {
    if (auth == null) {
      reject(new Error('You must be signed in'));
      return;
    }
    resolve(true);
  });
}
export default function useDeleteUserMutation() {
  return useMutation(handleDeleteUser);
}
