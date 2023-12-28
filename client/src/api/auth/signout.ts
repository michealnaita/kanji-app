import { useMutation } from 'react-query';
import { getAuth } from 'firebase/auth';

function handleSignOut(): Promise<true> {
  const auth = getAuth();
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 3000);
  });
}

export default function useSignOutMutation() {
  return useMutation(handleSignOut);
}
