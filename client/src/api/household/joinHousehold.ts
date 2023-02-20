import { FunctionResponse } from './../../utils/types';
import { HouseholdSlim } from '../../utils/types';
import { useMutation } from 'react-query';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../utils/firebase';
import { formatErrorMessage } from '../../utils/errors';
import { useApp } from '../../context/app';

enum errorCodes {
  ALREADY_HAS_SERVICE = 'ALREADY_HAS_SERVICE',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
}

type RequestData = { household: string };
function joinHouse(
  data: RequestData,
  updateHouseholds: (d: HouseholdSlim[]) => void
) {
  return new Promise((resolve, reject) => {
    const join = httpsCallable<RequestData, FunctionResponse>(
      functions,
      'joinHousehold'
    );
    join(data)
      .then(({ data }) => {
        if (data.status == 'success') {
          updateHouseholds(data.data?.households);
          resolve(true);
        }
        if (data.status === 'fail') {
          throw new Error(data.error?.message);
        }
      })
      .catch((e) => {
        reject(new Error(formatErrorMessage(e.message)));
      });
  });
}
export default function useJoinHouseholdMutation() {
  const { updateHouseholds } = useApp();
  return useMutation((data: RequestData) => joinHouse(data, updateHouseholds));
}
