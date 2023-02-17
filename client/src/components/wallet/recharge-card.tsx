import React from 'react';
import { useApp } from '../../context/app';
import Card from '../shared/cards/card-two';
import { useForm } from 'react-hook-form';
import useRechargeMutation from '../../api/getRechargeLink';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export default function RechargeCard() {
  const navigate = useNavigate();
  const { current_amount } = useApp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ amount: string }>();
  const { isLoading, isError, error, data, mutate } = useRechargeMutation();
  function onSubmit({ amount }: { amount: string }) {
    mutate(parseInt(amount));
  }
  React.useEffect(() => {
    if (isError) toast.error((error as Error).message);
  }, [isError]);
  React.useEffect(() => {
    if (data) window.location.href = data;
  }, [data]);
  return (
    <Card title="Wallet">
      <form
        className="flex flex-col space-y-4 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-skin-secondary font-semibold text-xl">
          Your Current Amount: shs.{current_amount}
        </h1>
        <div>
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
                value: 5000,
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
          className={
            isLoading
              ? 'font-semibold text-skin-secondary animate-pulse cursor-not-allowed'
              : 'text-skin-lime font-semibold'
          }
        >
          {isLoading ? 'please wait...' : 'recharge'}
        </button>
      </form>
    </Card>
  );
}
