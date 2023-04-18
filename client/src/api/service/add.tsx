import { useMutation } from 'react-query';
import { getAuth } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../utils/firebase';
import { AddServiceData, FunctionResponse, User } from '../../utils/types';
import { formatErrorMessage } from '../../utils/errors';
function addService(id: string): Promise<AddServiceData> {
  const auth = getAuth().currentUser;
  return new Promise((resolve, reject) => {
    if (auth == null) {
      reject(new Error('You must be signed in'));
      return;
    }
    const join = httpsCallable<
      { service_id: string },
      FunctionResponse<AddServiceData>
    >(functions, 'joinService');
    join({ service_id: id })
      .then(({ data: { status, error, data } }) => {
        if (status === 'fail') {
          reject({ message: error!.message });
          return;
        }
        resolve(data as AddServiceData);
      })
      .catch((e) => reject({ message: formatErrorMessage(e.code) }));
  });
}
export default function useAddServiceMutation() {
  return useMutation(addService);
}
