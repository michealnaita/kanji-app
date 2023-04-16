import { useMutation } from 'react-query';
import { getAuth } from 'firebase/auth';

function addService(id: string) {
  const auth = getAuth().currentUser;
  return new Promise((resolve, reject) => {
    if (auth == null) {
      reject(new Error('You must be signed in'));
      return;
    }
    resolve({ service: id });
  });
}
export default function useAddServiceMutation() {
  return useMutation(addService);
}
