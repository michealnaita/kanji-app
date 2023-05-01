import { Admin, FunctionResponse } from './../../utils/types';
import { useMutation } from 'react-query';
import { functions } from '../../utils/firebase';
import { httpsCallable } from 'firebase/functions';

type ResData = {
  houses: Admin['houses'];
  active_services: Admin['active_services'];
};
type ReqData = { house: string; user: string };
function removeFromHouse(data: ReqData): Promise<ResData> {
  return new Promise((resolve, reject) => {
    const remove = httpsCallable<ReqData, FunctionResponse<ResData>>(
      functions,
      'removeFromHouse'
    );
    remove(data).then(({ data: { status, data, error } }) => {
      if (status === 'fail') {
        reject({ message: error?.message });
        return;
      }
      if (status == 'success' && data) resolve(data);
    });
  });
}

export default function useRemoveFromeHouseMutation() {
  return useMutation(removeFromHouse);
}
