import { Popover } from '@headlessui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
    if (data) {
      const from = new URLSearchParams(window.location.search).get('from');
      if (from) {
        navigate(from);
      } else {
        navigate('/');
      }
    }
  }, [data]);

  return (
    <form
      className="flex flex-col form space-y-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <h1 className="font-semibold text-2xl">Hello!</h1>
        <p className="ont-semibold text-base text-skin-gray">
          Create account to continue
        </p>
      </div>

      <div className="space-y-4">
        <div
          className="form-group
        "
        >
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
        <div
          className="form-group
        "
        >
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            className="form-input mt-4"
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
        <div
          className="form-group
        "
        >
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            className="form-input "
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
        <div
          className="form-group
        "
        >
          <label htmlFor="email" className="flex space-x-2">
            <span>Email</span>
            <Popover className="text-sm inline relative">
              <Popover.Button>
                <span className="center w-5 h-5 rounded-full border border-skin-lime text-skin-lime place-self-center">
                  ?
                </span>
              </Popover.Button>
              <Popover.Panel className="absolute bg-white drop-shadow-md w-[170px] text-skin-dark z-10 -bottom-0 transform -translate-y-8 rounded-lg p-2">
                make sure that email is the same as for your spotify account
              </Popover.Panel>
            </Popover>
          </label>
          <input
            type="text"
            className="form-input "
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
        <div
          className="form-group
        "
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-input "
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
        <div
          className="form-group
        "
        >
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
      </div>
      <div className="space-y-4 place-self-center">
        <button
          disabled={isLoading}
          className={
            isLoading
              ? ' primary self-center disabled cursor-not-allowed animate-pulse'
              : 'primary self-center'
          }
        >
          {isLoading ? 'Please wait...' : 'Register'}
        </button>
        <p className="text-skin-secondary text-center underline">
          <Link to={'/signin'} className="text-skin-gray">
            Already have an account
          </Link>
        </p>
      </div>
    </form>
  );
}
