import { HouseholdSlim } from './../../../server/functions/src/utils/types';
import { httpsCallable } from 'firebase/functions';
import { useMutation } from 'react-query';
import { useApp } from '../context/app';
import { formatErrorMessage } from '../utils/errors';
import { functions } from '../utils/firebase';
import { FunctionResponse } from '../utils/types';

type RequestData = {
  code: string;
};

function getLink(
  data: RequestData,
  updatedHouseholds: (d: HouseholdSlim[]) => void
): Promise<{ message: string }> {
  return new Promise((resolve, reject) => {
    const redeemPromo = httpsCallable<RequestData, FunctionResponse>(
      functions,
      'redeemPromo'
    );
    redeemPromo(data)
      .then(({ data }) => {
        if (data.status === 'success') {
          updatedHouseholds(data.data?.households);
          resolve({ message: data.data?.message! });
        }
        if (data.status === 'fail') {
          reject(new Error(data.error?.message));
        }
      })
      .catch((e) => {
        reject(new Error(formatErrorMessage(e.message)));
      });
  });
}
export default function usePromoCode() {
  const { updateHouseholds } = useApp();
  return useMutation((data: RequestData) => getLink(data, updateHouseholds));
}
