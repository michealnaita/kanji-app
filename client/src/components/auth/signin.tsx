import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
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
      className="card flex flex-col form space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="light"
      />
      <ToastContainer />
      <h1 className="text-center font-semibold text-lg">Sign In</h1>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          className="form-input"
          defaultValue={'bob@gmail.com'}
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
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-input"
          defaultValue={'@Bo123'}
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
      <p className="text-skin-secondary italic">
        Don't have account{' '}
        <span className="text-skin-orange">
          <Link to="/register">Create account</Link>
        </span>
      </p>
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
    </form>
  );
}
