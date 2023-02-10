import { useMutation } from 'react-query';
import { useApp } from '../../context/app';
import { SignInData } from '../../utils/types';

function handleSignIn(
  data: SignInData,
  initialiseApp: (a: any) => void
): Promise<boolean> {
  const userData = {
    firstname: 'Micheal',
    lastname: 'Naita',
    email: 'michealnaita@gmail.com',
    phone: 1234567890,
    current_amount: 12000,
    households: [
      { id: '12345678', name: 'The lules', service: 'netflix' },
      { id: '12345678', name: 'The kamyas', service: 'spotify' },
    ],
  };

  return new Promise((resolve, reject) => {
    initialiseApp({ ...userData, username: 'michealanaita' });
    setTimeout(() => resolve(true), 5000);
  });
}
export default function useSignInMutation() {
  const { load } = useApp();
  return useMutation((d: SignInData) => handleSignIn(d, load));
}
