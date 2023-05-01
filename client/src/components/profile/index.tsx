import React from 'react';
import { WithErrorMessage } from './form-utils';
import { useForm } from 'react-hook-form';
import { useApp } from '../../context/app';
import PageCard from '../shared/cards/card-two';
import { ImPencil } from 'react-icons/im';
import { BsX } from 'react-icons/bs';
import { Disclosure } from '@headlessui/react';
import VerifyAction from './verify-action';
import cn from 'classnames';
import useDeleteUserMutation from '../../api/user/delete';
import useUpdateUserMutation from '../../api/user/update';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../settings';

export type UserProfileForm = {
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  password: string;
};

export default function ProfileForm() {
  const [editBasic, setEditBasic] = React.useState<boolean>(false);
  const [editContact, setEditContact] = React.useState<boolean>(false);
  const del = useDeleteUserMutation();
  const update = useUpdateUserMutation();
  const navigate = useNavigate();
  const { firstname, lastname, email, phone, updateUserProfile } = useApp();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UserProfileForm>({
    defaultValues: {
      firstname,
      lastname,
      email,
      phone,
      password: '',
    },
  });
  React.useEffect(() => {
    if (del.data) {
      toast.success('Account Deleted');
      setTimeout(() => {
        navigate(routes.signout);
      }, 2000);
    }
  }, [del.data]);
  React.useEffect(() => {
    if (update.data) {
      updateUserProfile(update.data);
      toast.success('Profile updated');
    }
  }, [update.data]);

  React.useEffect(() => {
    if (del.error) {
      toast.error((del.error as Error).message);
    }
  }, [del.isError]);

  React.useEffect(() => {
    if (update.error) {
      toast.error((update.error as Error).message);
    }
  }, [update.isError]);
  return (
    <PageCard title="Profile">
      <form
        className="space-y-7 flex flex-col "
        onSubmit={handleSubmit((data) => update.mutate(data))}
      >
        <div className="space-y-4">
          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Basic Info</h1>
            <button type="button" onClick={() => setEditBasic(!editBasic)}>
              {editBasic ? <BsX size="25" /> : <ImPencil />}
            </button>
          </div>
          <div className="form-group-alt ">
            <label className="text-skin-primary" htmlFor="firstname">
              First Name:
            </label>
            <WithErrorMessage
              message={errors && errors.firstname && errors.firstname.message}
            >
              <input
                className={cn({ edit: editBasic })}
                type={'text'}
                id="firstname"
                readOnly={!editBasic}
                {...register('firstname', {
                  required: "firstname can't be empty",
                })}
              />
            </WithErrorMessage>
          </div>
          <div className="form-group-alt">
            <label className="text-skin-primary" htmlFor="lastname">
              Last Name:
            </label>
            <WithErrorMessage
              message={errors && errors.lastname && errors.lastname.message}
            >
              <input
                className={cn({ edit: editBasic })}
                type={'text'}
                readOnly={!editBasic}
                id="lastname"
                {...register('lastname', {
                  required: "lastname can't be empty",
                })}
              />
            </WithErrorMessage>
          </div>
          <div className="form-group-alt">
            <label className="text-skin-primary" htmlFor="lastname">
              Password:
            </label>
            <WithErrorMessage
              message={errors && errors.lastname && errors.lastname.message}
            >
              <input
                className={cn({ edit: editBasic })}
                type="password"
                placeholder="********"
                readOnly={!editBasic}
                id="password"
                {...register('password', {
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{5,}$/,
                    message:
                      'must contain atleast a capital and small letter, number and special character ',
                  },
                })}
              />
            </WithErrorMessage>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <h1 className=" text-lg font-semibold">Contact Info</h1>
            <button type="button" onClick={() => setEditContact(!editContact)}>
              {editContact ? <BsX size="25" /> : <ImPencil />}
            </button>
          </div>
          <div className="form-group-alt">
            <label className="text-skin-primary">Email</label>
            <input type={'text'} readOnly {...register('email')} />
          </div>
          <div className="form-group-alt">
            <label className="text-skin-primary" htmlFor="">
              Phone:
            </label>
            <WithErrorMessage
              message={errors && errors.phone && errors.phone.message}
            >
              <input
                className={cn({ edit: editContact })}
                type="text"
                readOnly={!editContact}
                id="phone"
                {...register('phone', {
                  required: { value: true, message: 'phone is required' },
                  pattern: {
                    value: /(0*)7[2|4|7|6|5|0|8]\d{7}/,
                    message: 'please use a valid phone number eg. 0777123456',
                  },
                })}
              />
            </WithErrorMessage>
          </div>
        </div>
        {isDirty && (
          <>
            <button
              type="submit"
              disabled={update.isLoading}
              className={
                update.isLoading
                  ? ' primary self-center disabled:cursor-not-allowed animate-pulse'
                  : 'primary self-center'
              }
            >
              {update.isLoading ? 'Please wait...' : 'Save'}
            </button>
          </>
        )}
      </form>
      <div className=" flex flex-col space-y-4 mt-10">
        <h1 className=" text-lg font-semibold text-red-500 border-b  border-b-red-500">
          DANGER
        </h1>
        <h1 className=" text-lg font-semibold ">Delete Account</h1>
        <p className="text-skin-gray">
          Delete your account and all of your services and profile data. This is
          irreversible.
        </p>
        <div className=" align-center space-y-10">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Panel>
                  <VerifyAction
                    code="delete-me"
                    action={() => {
                      !del.isLoading && del.mutate();
                    }}
                    label="Type [delete-me] to delete account"
                    errorMessage="code should match delete code"
                    button="Confirm"
                    danger
                  />
                </Disclosure.Panel>
                <Disclosure.Button
                  className={cn(
                    'place-self-center',
                    open ? 'primary' : 'danger'
                  )}
                >
                  {open ? 'Cancel' : 'Delete Account'}
                </Disclosure.Button>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </PageCard>
  );
}
