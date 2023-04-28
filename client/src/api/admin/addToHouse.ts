import { Admin, FunctionResponse } from './../../utils/types';
import { useMutation } from 'react-query';
import { functions } from '../../utils/firebase';
import { httpsCallable } from 'firebase/functions';

type ResData = {
  houses: Admin['houses'];
  active_services: Admin['active_services'];
  pending_requests: Admin['pending_requests'];
};
type ReqData = { house: string; user: string };
function addToHouse(data: ReqData): Promise<ResData> {
  return new Promise((resolve, reject) => {
    const add = httpsCallable<ReqData, FunctionResponse<ResData>>(
      functions,
      'addToHouse'
    );
    add(data).then(({ data: { status, data, error } }) => {
      if (status === 'fail') {
        reject({ message: error?.message });
        return;
      }
      if (status == 'success' && data) resolve(data);
    });
  });
}

export default function useAddToHouseMutation() {
  return useMutation(addToHouse);
}
