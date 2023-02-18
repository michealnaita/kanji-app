import React from 'react';
import Card from '../shared/cards/card-two';
import { useForm } from 'react-hook-form';
import useRechargeMutation from '../../api/usePromoCode';
import { toast } from 'react-toastify';
import DialogPrompt from './dialog';
export default function RechargeCard() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ code: string }>();
  const { isLoading, isError, error, data, mutate } = useRechargeMutation();

  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  function onSubmit({ code }: { code: string }) {
    mutate({ code });
  }
  React.useEffect(() => {
    if (isError) toast.error((error as Error).message);
  }, [isError]);
  React.useEffect(() => {
    if (data) {
      setMessage(data.message);
      setOpen(true);
    }
  }, [data]);
  return (
    <>
      <DialogPrompt
        message={message}
        closeModal={() => setOpen(false)}
        isOpen={isOpen}
      />
      <Card title="Promo Code">
        <form
          className="flex flex-col space-y-4 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-skin-secondary font-semibold text-xl">
            Apply your Promo Code
          </h1>
          <div>
            <label htmlFor="code">Code</label>
            <input
              id="code"
              className="form-input"
              type="text"
              {...register('code', {
                required: {
                  value: true,
                  message: 'please type in code',
                },
                pattern: {
                  value: /KJI-[A-Z|\d]{6}/,
                  message: 'please use a valid promo code',
                },
              })}
            />
            {errors.code && (
              <span className="text-sm text-skin-red">
                {errors.code.message}
              </span>
            )}
          </div>
          <button
            disabled={isLoading}
            className={
              isLoading
                ? 'font-semibold text-skin-secondary animate-pulse cursor-not-allowed'
                : 'text-skin-lime font-semibold'
            }
          >
            {isLoading ? 'please wait...' : 'redeem'}
          </button>
        </form>
      </Card>
    </>
  );
}
