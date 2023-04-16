import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useResetPasswordMutation from '../../api/auth/reset-password';

export default function SignInForm() {
  const navigate = useNavigate();
  const { mutate, isLoading, error, isError, data } =
    useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();
  function onSubmit(data: { email: string }) {
    mutate(data);
  }
  React.useEffect(() => {
    if (data) navigate('/signin');
  }, [data]);
  React.useEffect(() => {
    if (isError) toast.error((error as Error).message);
  }, [isError]);
  return (
    <form
      className=" flex flex-col form space-y-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <h1 className="font-semibold text-2xl">Reset Password</h1>
        <p className="ont-semibold text-base text-skin-gray">
          We will send a password reset link to your email
        </p>
      </div>
      <div className="space-y-4  align-center">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="form-input"
            id="email"
            {...register('email', {
              required: { value: true, message: 'email is required' },
              pattern: {
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Please use a valid email',
              },
            })}
          />
          {errors.email && (
            <span className="text-skin-red text-sm italic">
              {errors.email.message}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-4 align-center">
        <button
          disabled={isLoading}
          className={
            isLoading
              ? ' primary self-center disabled cursor-not-allowed animate-pulse'
              : 'primary self-center'
          }
        >
          {isLoading ? 'Please wait...' : 'Reset'}
        </button>
        <p className="text-skin-secondary text-center underline">
          <Link
            to={'/register' + window.location.search}
            className="text-skin-gray"
          >
            Dont have an account
          </Link>
        </p>
      </div>
    </form>
  );
}
