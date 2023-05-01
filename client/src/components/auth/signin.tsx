import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useSignInMutation from '../../api/auth/signin';
import { SignInData } from '../../utils/types';

export default function SignInForm() {
  const navigate = useNavigate();
  const { mutate, isLoading, error, isError, data } = useSignInMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>();
  function onSubmit(data: SignInData) {
    mutate(data);
  }
  React.useEffect(() => {
    if (data) {
      const from = new URLSearchParams(window.location.search).get('from');
      if (from) {
        navigate(from);
      } else {
        navigate('/');
      }
    }
  }, [data]);
  React.useEffect(() => {
    if (isError) toast.error((error as Error).message);
  }, [isError]);
  return (
    <form
      className="flex flex-col form space-y-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <h1 className="font-semibold text-2xl">Welcome back</h1>
        <p className="ont-semibold text-base text-skin-gray">
          Sign in to continue
        </p>
      </div>
      <div className="space-y-4 align-center">
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
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-input"
            id="password"
            {...register('password', {
              required: { value: true, message: 'password is required' },
            })}
          />
          {errors.password && (
            <span className="text-skin-red text-sm italic">
              {errors.password.message}
            </span>
          )}
        </div>
        <p className="text-skin-secondary text-center underline">
          <Link to={'/password'} className="text-skin-gray">
            Forgot password?
          </Link>
        </p>
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
          {isLoading ? 'Please wait...' : 'Sign In'}
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
