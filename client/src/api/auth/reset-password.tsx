import { useMutation } from 'react-query';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { formatErrorMessage } from '../../utils/errors';

function handleResetPassword({ email }: { email: string }): Promise<boolean> {
  return new Promise((resolve, reject) => {
    sendPasswordResetEmail(auth, email)
      .then((_) => resolve(true))
      .catch((e) => reject(new Error(formatErrorMessage(e.code))));
  });
}
export default function useResetPasswordMutation() {
  return useMutation(handleResetPassword);
}
