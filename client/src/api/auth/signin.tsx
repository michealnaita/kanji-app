import { useMutation } from 'react-query';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { SignInData } from '../../utils/types';
import { auth } from '../../utils/firebase';
import { formatErrorMessage } from '../../utils/errors';

function handleSignIn({ email, password }: SignInData): Promise<boolean> {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((_) => resolve(true))
      .catch((e) => reject(new Error(formatErrorMessage(e.code))));
  });
}
export default function useSignInMutation() {
  return useMutation(handleSignIn);
}
