import React from 'react';
import Layout from '../components/layout';
import { BsEnvelope } from 'react-icons/bs';
import toast from 'react-hot-toast';
import useVerifyEmailMutation from '../api/auth/verify-email';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import { routes } from '../settings';

export default function ErrorPage() {
  const navigate = useNavigate();
  const { isEmailVerified } = useAuth();
  const { mutate, isLoading, error, isError, data } = useVerifyEmailMutation();
  React.useEffect(() => {
    if (data) {
      toast.success('verification email sent');
    }
  }, [data]);
  React.useEffect(() => {
    if (isError) toast.error((error as Error).message);
  }, [isError]);
  React.useEffect(() => {
    if (isEmailVerified) {
      navigate(routes.dashboard);
    } else {
      mutate();
    }
  }, []);
  return (
    <Layout title="Verify Email" className="px-6 center space-y-10">
      <div className="w-full  flex flex-col items-center justify-center space-y-3 card">
        <h1 className="flex items-center space-x-4 text-2xl font-semibold">
          <span>
            <BsEnvelope />
          </span>
          <span> Verify Email</span>
        </h1>
        <p className="text-base text-center">
          Verify your email address by following link send to your email address
        </p>
      </div>
      <button
        className="text-skin-secondary text-center underline"
        disabled={isLoading}
        onClick={() => mutate()}
      >
        Resend Link
      </button>
    </Layout>
  );
}
