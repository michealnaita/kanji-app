import { HouseholdSlim } from './../../utils/types';
import { FunctionResponse, User } from '../../utils/types';
import { useMutation } from 'react-query';
import { functions } from '../../utils/firebase';
import { formatErrorMessage } from '../../utils/errors';
import { useApp } from '../../context/app';
import { httpsCallable } from 'firebase/functions';

type RequestData = { household: string };
function leaveHouse(
  data: RequestData,
  updateHouseholds: (d: HouseholdSlim[]) => void
) {
  return new Promise(async (resolve, reject) => {
    const leave = httpsCallable<RequestData, FunctionResponse>(
      functions,
      'leaveHousehold'
    );
    leave(data)
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
export default function useLeaveHouseholdMutation() {
  const { updateHouseholds } = useApp();
  return useMutation((data: RequestData) => leaveHouse(data, updateHouseholds));
}

