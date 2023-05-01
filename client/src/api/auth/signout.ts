import { useMutation } from 'react-query';
import { getAuth, signOut } from 'firebase/auth';

function handleSignOut(): Promise<true> {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    if (!auth) {
      reject({ message: 'You need to be signed in' });
      return;
    }
    signOut(auth)
      .then((_) => resolve(true))
      .catch((e) => reject({ message: e.code }));
  });
}

export default function useSignOutMutation() {
  return useMutation(handleSignOut);
}
