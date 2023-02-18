import { httpsCallable } from 'firebase/functions';
import { useMutation } from 'react-query';
import { formatErrorMessage } from '../utils/errors';
import { functions } from '../utils/firebase';

type RequestData = {
  amount: number;
  name: string;
  phone: number;
  email: string;
};
function getLink(data: RequestData): Promise<string> {
  return new Promise((resolve, reject) => {
    const generateRechargeLink = httpsCallable(
      functions,
      'generateRechargeLink'
    );
    generateRechargeLink(data)
      .then(({ data }: any) => {
        if (data.status === 'success') resolve(data.data.link);
      })
      .catch((e) => {
        reject(new Error(formatErrorMessage(e.message)));
      });
  });
}
export default function useRechargeMutation() {
  return useMutation(getLink);
}
