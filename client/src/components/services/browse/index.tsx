import React from 'react';
import { formatPrice, getBrandLogo } from '../../../utils/utils';
import { BsPlus } from 'react-icons/bs';
import { useApp } from '../../../context/app';
import useAddServiceMutation from '../../../api/service/add';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../settings';
import ConfirmationModal from '../../shared/confirm-modal';
import { useAuth } from '../../../context/auth';

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
  const { addService, services, current_amount } = useApp();
  const { isAuthenticated } = useAuth();
  const { mutate, isLoading, data, error, isError } = useAddServiceMutation();
  const [show, setShow] = React.useState(false);
  const [showRecharge, setShowRecharge] = React.useState(false);
  function handleAddService() {
    setShow(false);
    if (!isAuthenticated) {
      const s = new URLSearchParams();
      s.set('from', location.pathname);
      navigate('/signin?' + s.toString());
      return;
    }

    if (price && current_amount - price < 0) {
      setShowRecharge(true);
      return;
    }
    mutate(id);
    toast.loading('please wait...');
  }
  function handleClick() {
    const hasService = !!services.filter((s) => s.id === id).length;
    if (hasService) {
      toast('you already have this service');
      return;
    }
    setShow(true);
  }
  React.useEffect(() => {
    // TODO: update user
    if (data) {
      addService(data);
      toast.success('services added');
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
      <div className="card !py-10 h-[120px] flex items-center justify-between ">
        <div className="space-y-2">
          <img src={getBrandLogo(id)} alt={id} />
          {!!price && (
            <p className="text-skin-secondary">UGX {formatPrice(price)}</p>
          )}
        </div>
        <button onClick={handleClick} disabled={!available || isLoading}>
          <BsPlus color={available ? 'white' : '#1E2022'} size="30" />
        </button>
      </div>
      <ConfirmationModal
        title="New Subscription"
        open={show}
        onClose={() => setShow(false)}
        action={handleAddService}
      >
        You are subscribing to{' '}
        <span className="font-semibold">
          {id} for UGX {!!price && formatPrice(price)}
        </span>
      </ConfirmationModal>
      <ConfirmationModal
        title="Insufficient Balance"
        open={showRecharge}
        onClose={() => setShowRecharge(false)}
        action={() => navigate(routes.recharge)}
        buttonText="Top Up"
      >
        You dont have enough money to pay for{' '}
        <span className="font-semibold">
          {id} at UGX {!!price && formatPrice(price)}
        </span>
      </ConfirmationModal>
    </>
  );
}
