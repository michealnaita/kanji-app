import { useMutation } from 'react-query';
import { getAuth } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../utils/firebase';
import { AddServiceData, FunctionResponse } from '../../utils/types';
import { formatErrorMessage } from '../../utils/errors';
function extendSubscription({
  service_id,
  duration,
}: {
  duration: number;
  service_id: string;
}): Promise<AddServiceData> {
  const auth = getAuth().currentUser;
  return new Promise((resolve, reject) => {
    if (auth == null) {
      reject(new Error('You must be signed in'));
      return;
    }
    const extend = httpsCallable<
      { service_id: string; duration: number },
      FunctionResponse<AddServiceData>
    >(functions, 'extendSubscription');
    extend({ service_id: service_id, duration })
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
export default function useExtendSubscriptionMutation() {
  return useMutation(extendSubscription);
}
