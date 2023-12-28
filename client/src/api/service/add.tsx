import { useMutation } from 'react-query';
import { AddServiceData } from '../../utils/types';
import moment from 'moment';
function addService(id: string): Promise<AddServiceData> {
  return new Promise((resolve, reject) => {
    setTimeout(
      () =>
        resolve({
          transactions: [
            {
              amount: 4000,
              action: 'service-payment',
              at: new Date().toISOString(),
            },
          ],
          notifications: [
            {
              message:
                'You have been charged UGX 4000 for your spotify subscription',
              at: moment().toISOString(),
            },
          ],
          current_amount: 6000,
          services: [
            {
              id: 'spotify',
              price: 4000,
              renewal: moment().add('months', 1).toISOString(),
              status: 'active',
              at: moment().toISOString(),
              membership: 'Premium',
            },
          ],
        }),
      3000
    );
  });
}
export default function useAddServiceMutation() {
  return useMutation(addService);
}
