import { useMutation } from 'react-query';

function handleResetPassword(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 3000);
  });
}
export default function useResetPasswordMutation() {
  return useMutation(handleResetPassword);
}
