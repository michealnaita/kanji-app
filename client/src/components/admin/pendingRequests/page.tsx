import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAddToHouseMutation from '../../../api/admin/addToHouse';
import useAdmin from '../../../context/admin';
import { routes } from '../../../settings';
import PageWrapper from '../../shared/cards/card-two';
import ConfirmationModal from '../../shared/confirm-modal';

export default function PendingRequest({ uid }: { uid: string }) {
  const navigate = useNavigate();
  const { mutate, isLoading, isError, error, data } = useAddToHouseMutation();
  const [dialog, setDialog] = React.useState(false);
  const { houses, pending_requests, updateAdmin } = useAdmin();
  const { house, request } = React.useMemo(
    () => ({
      house: houses.filter(({ capacity: c }) => c < 5)[0],
      request: pending_requests.filter(({ uid: u }) => u === uid)[0],
    }),
    []
  );
  if (!house) {
    navigate('/404');
  }
  const userDetails: { [k: string]: string } = React.useMemo(
    () => ({
      UID: request.uid,
      Name: request.name,
      Email: request.email,
      Service: request.service,
      'Created At': new Date(request.at).toUTCString(),
    }),

    []
  );
  const houseDetails: { [k: string]: any } = React.useMemo(
    () => ({
      'Account Email': house.email,
      Service: house.service,
      Capactity: house.capacity,
    }),

    []
  );
  function handleAddToHouse() {
    mutate({ house: house.id, user: request.uid });
    toast.loading('please wait...');
  }
  React.useEffect(() => {
    // TODO: update user
    if (data) {
      updateAdmin(data);
      toast.success('user added to house');
      setTimeout(() => navigate(routes.dashboard), 2000);
    }
  }, [data]);
  React.useEffect(() => {
    if (error) {
      toast.error((error as any).message);
    }
  }, [isError]);
  return (
    <>
      <ConfirmationModal
        open={dialog}
        action={() => {}}
        onClose={() => setDialog(false)}
        title="Add User to House"
        buttonText="Continue"
      >
        Are you sure, you want to add user to this house
      </ConfirmationModal>
      <PageWrapper title="Pending Request" className="space-y-10">
        <div className="space-y-4">
          <h1 className="font-semibold">User Info</h1>
          <ul className="space-y-2">
            {Object.keys(userDetails).map((key, i) => (
              <li className="flex justify-between " key={i}>
                <p>{key}</p>
                <p>{userDetails[key]}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 flex flex-col">
          <h1 className="font-semibold">Available House</h1>
          <ul className="space-y-2">
            {Object.keys(houseDetails).map((key, i) => (
              <li className="flex justify-between " key={i}>
                <p>{key}</p>
                <p>{houseDetails[key]}</p>
              </li>
            ))}
          </ul>
          <button
            className="primary place-self-center"
            onClick={() => setDialog(true)}
          >
            Add to House
          </button>
        </div>
      </PageWrapper>
    </>
  );
}
