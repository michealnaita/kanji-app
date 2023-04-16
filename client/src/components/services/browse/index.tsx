import React from 'react';
import { formatPrice, getBrandLogo } from '../../../utils/utils';
import { BsPlus } from 'react-icons/bs';
import { useApp } from '../../../context/app';
import { Dialog } from '@headlessui/react';
import useAddServiceMutation from '../../../api/service/add';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ConfirmationModal({
  open,
  action,
  onClose,
  children,
  title,
}: {
  open: boolean;
  action: () => void;
  onClose: () => void;
  children: any;
  title: string;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Panel className="menu-card">
        <div className="menu-container space-y-7 text-black">
          <h1 className="font-semibold">{title}</h1>
          <p>{children}</p>
          <div className="space-y-4">
            <button className="primary" onClick={action}>
              Confirm
            </button>
            <button className="primary-alt" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
export default function ServiceCard({
  price,
  id,
  available,
}: {
  price?: number;
  id: string;
  available?: boolean;
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const { mutate, isLoading, data, error, isError } = useAddServiceMutation();
  const [show, setShow] = React.useState(false);
  function addService() {
    setShow(false);
    if (!isAuthenticated) {
      const s = new URLSearchParams();
      s.set('from', location.pathname);
      navigate('/signin?' + s.toString());
      return;
    }
    mutate(id);
  }
  React.useEffect(() => {
    // TODO: update user
    if (data) {
      toast.success('services added');
    }
  }, [data]);
  React.useEffect(() => {
    if (error) {
      toast.success((error as Error).message);
    }
  }, [isError]);
  return (
    <>
      <div className="card !py-10 h-[120px] flex items-center justify-between ">
        <div className="space-y-2">
          <img src={getBrandLogo(id)} alt={id} />
          {!!price && (
            <p className="text-skin-secondary">UGX {formatPrice(price)}</p>
          )}
        </div>
        <button
          onClick={() => setShow(true)}
          disabled={!available || isLoading}
        >
          <BsPlus color={available ? 'white' : '#1E2022'} size="30" />
        </button>
      </div>
      <ConfirmationModal
        title="New Subscription"
        open={show}
        onClose={() => setShow(false)}
        action={addService}
      >
        You are subscribing to{' '}
        <span className="font-semibold">
          {id} for UGX {!!price && formatPrice(price)}
        </span>
      </ConfirmationModal>
    </>
  );
}
