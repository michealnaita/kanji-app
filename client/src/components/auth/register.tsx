import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import useRegisterMutation from '../../api/auth/register';
import { RegisterData } from '../../utils/types';
export default function RegiserForm() {
  const navigate = useNavigate();
  const { mutate, isLoading, error, isError, data } = useRegisterMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();
  function onSubmit(data: RegisterData) {
    mutate(data);
  }
  React.useEffect(() => {
    if (isError) toast.error((error as Error).message);
  }, [isError]);
  React.useEffect(() => {
    if (data) navigate('/');
  }, [data]);

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
      {/* Same as */}
      <ToastContainer />
      <h1 className="text-center font-semibold text-lg">Create Account</h1>
      <div>
        <label htmlFor="firstname">First Name</label>
        <input
          type="text"
          className="form-input"
          id="name"
          {...register('firstname', {
            required: { value: true, message: 'first name is required' },
          })}
        />
        {errors.firstname && (
          <span className="text-skin-red text-sm italic">
            {errors.firstname.message}
          </span>
        )}
      </div>
      <div>
        <label htmlFor="lastname">Last Name</label>
        <input
          type="text"
          className="form-input"
          id="lastname"
          {...register('lastname', {
            required: { value: true, message: 'last name is required' },
          })}
        />
        {errors.lastname && (
          <span className="text-skin-red text-sm italic">
            {errors.lastname.message}
          </span>
        )}
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          className="form-input"
          id="phone"
          {...register('phone', {
            required: { value: true, message: 'phone is required' },
            pattern: {
              value: /07[2|4|7|6|5|0|8]\d{7}/,
              message: 'please use a valid phone number eg. 0777123456',
            },
          })}
        />
        {errors.phone && (
          <span className="text-skin-red text-sm italic">
            {errors.phone.message}
          </span>
        )}
      </div>
      <div>
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
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-input"
          id="password"
          {...register('password', {
            required: { value: true, message: 'password is required' },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{5,}$/,
              message:
                'must contain atleast a capital and small letter, number and special character ',
            },
          })}
        />
        {errors.password && (
          <span className="text-skin-red text-sm italic">
            {errors.password.message}
          </span>
        )}
      </div>
      <div>
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          className="form-input"
          id="confirm-password"
          {...register('confirm_password', {
            required: { value: true, message: 'confirm your password' },
            validate: (v) => v === watch('password'),
          })}
        />
        {errors.confirm_password && (
          <span className="text-skin-red text-sm italic">
            should match password
          </span>
        )}
      </div>
      <p className="text-skin-secondary italic">
        Already have account{' '}
        <span className="text-skin-orange">
          <Link to="/signin">Log In</Link>
        </span>
      </p>
      <button
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
