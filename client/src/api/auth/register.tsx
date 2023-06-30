import { useMutation } from 'react-query';

function handleRegister(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 3000);
  });
}
export default function useRegisterMutation() {
  return useMutation(handleRegister);
}
