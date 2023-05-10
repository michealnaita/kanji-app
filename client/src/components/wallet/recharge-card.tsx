import React from 'react';
import { useApp } from '../../context/app';
import Card from '../shared/cards/card-two';
import { useForm } from 'react-hook-form';
import useRechargeMutation from '../../api/getRechargeLink';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../settings';
export default function RechargeCard() {
  const navigate = useNavigate();
  const { current_amount, firstname, lastname, email, phone } = useApp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ amount: string }>();
  const { isLoading, isError, error, data, mutate } = useRechargeMutation();
  function onSubmit({ amount }: { amount: string }) {
    const reqData = {
      name: `${firstname} ${lastname}`,
      amount: parseFloat(amount),
      email,
      phone,
    };
    mutate(reqData);
  }
  React.useEffect(() => {
    if (isError) toast.error((error as Error).message);
  }, [isError]);
  React.useEffect(() => {
    if (data) {
      const s = new URLSearchParams({ url: data });
      navigate(routes.flutterRedirect + '?' + s.toString());
    }
  }, [data]);
  return (
    <Card title="Recharge">
      <form
        className="flex flex-col space-y-7"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <p className="font-semibold">Current balance</p>
          <div className="card text-2xl font-semibold text-center text-skin-secondary">
            <span>UGX {formatPrice(current_amount)}</span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="amount">
            Amount{' '}
            <span className="text-skin-secondary italic text-sm">
              (min: shs.5000)
            </span>
          </label>
          <input
            id="amount"
            className="form-input"
            type="number"
            {...register('amount', {
              required: {
                value: true,
                message: 'please type in amount',
              },
              min: {
                value: 1000,
                message: 'amount should be more than shs. 5000',
              },
            })}
          />
          {errors.amount && (
            <span className="text-sm text-skin-red">
              {errors.amount.message}
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
  );
}
