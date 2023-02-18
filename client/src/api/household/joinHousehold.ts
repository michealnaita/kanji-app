import { HouseholdSlim } from '../../utils/types';
import { useMutation } from 'react-query';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../utils/firebase';
import { formatErrorMessage } from '../../utils/errors';

enum errorCodes {
  ALREADY_HAS_SERVICE = 'ALREADY_HAS_SERVICE',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
}

type ResponseData = {
  status: string;
  data?: HouseholdSlim;
  code?: string;
};
type RequestData = { household: string };
function joinHouse(data: RequestData) {
  return new Promise((resolve, reject) => {
    const join = httpsCallable<RequestData, ResponseData>(
      functions,
      'joinHousehold'
    );
    join(data)
      .then(({ data }) => {
        if (data.status !== 'success') {
          if (data.code && data.code == errorCodes.ALREADY_HAS_SERVICE)
            throw new Error('You already have this service');
          if (data.code && data.code == errorCodes.INSUFFICIENT_BALANCE)
            throw new Error(
              'Your balnace insufficient to join this service, you can leave a houshold or top up'
            );
        }
        resolve(true);
      })
      .catch((e) => {
        reject(new Error(formatErrorMessage(e.message)));
      });
  });
}
export default function useJoinHouseholdMutation() {
  return useMutation(joinHouse);
}
