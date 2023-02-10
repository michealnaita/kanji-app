import { useMutation } from 'react-query';
import { useApp } from '../../context/app';
import { RegisterData } from '../../utils/types';

function handleRegister(
  data: RegisterData,
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
    setTimeout(() => resolve(true), 3000);
  });
}
export default function useRegisterMutation() {
  const { load } = useApp();
  return useMutation((d: RegisterData) => handleRegister(d, load));
}
