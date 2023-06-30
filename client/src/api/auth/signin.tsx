import { useMutation } from 'react-query';

function handleSignIn(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 3000);
  });
}
export default function useSignInMutation() {
  return useMutation(handleSignIn);
}
