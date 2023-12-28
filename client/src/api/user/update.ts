import { useMutation } from 'react-query';
import { UserProfileForm } from '../../components/profile';

function updateUser({ phone, firstname, lastname }: UserProfileForm): Promise<{
  phone: number;
  firstname: string;
  lastname: string;
}> {
  return new Promise(async (res) => {
    setTimeout(() => res({ phone, firstname, lastname }), 3000);
  });
}
export default function useUpdateUserMutation() {
  return useMutation(updateUser);
}
