import { useMutation } from 'react-query';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { formatErrorMessage } from '../../utils/errors';

function handleSendEmailVerification(): Promise<boolean> {
  const user = auth.currentUser;
  return new Promise((resolve, reject) => {
    if (user) {
      sendEmailVerification(user)
        .then((_) => resolve(true))
        .catch((e) => reject(new Error(formatErrorMessage(e.code))));
    }
  });
}
export default function useVerifyEmailMutation() {
  return useMutation(handleSendEmailVerification);
}
