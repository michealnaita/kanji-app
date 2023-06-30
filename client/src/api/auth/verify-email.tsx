import { useMutation } from 'react-query';

function handleSendEmailVerification(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 3000);
  });
}
export default function useVerifyEmailMutation() {
  return useMutation(handleSendEmailVerification);
}
