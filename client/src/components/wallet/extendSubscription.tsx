import React from 'react';
import { useApp } from '../../context/app';
import Card from '../shared/cards/card-two';
import { useForm } from 'react-hook-form';
import useRechargeMutation from '../../api/getRechargeLink';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import { routes, settings } from '../../settings';
import useExtendSubscriptionMutation from '../../api/service/extendSubscription';
import ConfirmationModal from '../shared/confirm-modal';

export default function RechargeCard({ service_id }: { service_id: string }) {
  const [duration, setDuration] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const navigate = useNavigate();
  const { current_amount, addService: updateState } = useApp();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ duration: string }>({ defaultValues: { duration: '1' } });
  const { isLoading, isError, error, data, mutate } =
    useExtendSubscriptionMutation();
  function onSubmit({ duration }: { duration: string }) {
    if (current_amount - parseInt(watch().duration) * 4000 < 0) {
      toast.error('You have insufficient balance to make this transaction');
      return;
    }
    if (!service_id) {
      toast.error('missing service id');
      return;
    }
    setDuration(parseFloat(duration));
    setShow(true);
  }
  function extend() {
    const reqData = {
      duration,
      service_id,
    };
    mutate(reqData);
  }
  React.useEffect(() => {
    if (isError) toast.error((error as Error).message);
  }, [isError]);
  React.useEffect(() => {
    if (data) {
      toast.success('You have successfully extended your subscription');
      updateState(data);
      setTimeout(() => navigate(routes.dashboard), 3000);
    }
  }, [data]);
  return (
    <>
      <ConfirmationModal
        title="Extend Subscription"
        action={extend}
        open={show}
        onClose={() => setShow(false)}
        buttonText="Pay now"
      >
        You are about to extend your <b>{service_id}</b> subscription by{' '}
        <b>{duration}</b> months at a cost of{' '}
        <b>UGX {formatPrice(parseInt(watch().duration) * 4000)}</b>
      </ConfirmationModal>
      <Card title="Extend Subscription">
        <form
          className="flex flex-col space-y-7"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <p className="font-semibold">Amount charged</p>
            <div className="card text-2xl font-semibold text-center text-skin-secondary">
              <span>UGX {formatPrice(parseInt(watch().duration) * 4000)}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="duration">
              Duration{' '}
              <span className="text-skin-secondary italic text-sm">
                (min: 1 month)
              </span>
            </label>
            <input
              id="duration"
              className="form-input"
              type="number"
              {...register('duration', {
                required: {
                  value: true,
                  message: 'please type in duration',
                },
                min: {
                  value: 0,
                  message: 'duration should not be 0',
                },
              })}
            />
            {errors.duration && (
              <span className="text-sm text-skin-red">
                {errors.duration.message}
              </span>
            )}
          </div>
          <button
            disabled={isLoading}
            className={
              isLoading
                ? 'primary self-center disabled cursor-not-allowed animate-pulse'
                : 'primary self-center'
            }
          >
            {isLoading ? 'Please wait...' : 'Confirm'}
          </button>
        </form>
      </Card>
    </>
  );
}
