import React from 'react';
import Layout from '../components/layout';
import { BsEnvelope } from 'react-icons/bs';
import { toast } from 'react-toastify';
import useSignOutMutation from '../api/auth/signout';
import { routes } from '../settings';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/app';

export default function SignOutPage() {
  const { signOut } = useApp();
  const navigate = useNavigate();
  const { mutate, error, isError, data } = useSignOutMutation();
  React.useEffect(() => {
    if (data) {
      signOut();
      setTimeout(() => navigate(routes.about), 1000);
    }
  }, [data]);
  React.useEffect(() => {
    if (isError) toast.error((error as Error).message);
  }, [isError]);
  React.useEffect(() => {
    mutate();
  }, []);
  return (
    <Layout title="Sign Out" className="px-6 center space-y-10">
      <div className="w-full  min-h-[250px] center space-y-3 card">
        <h1 className="flex items-center space-x-4 text-2xl font-semibold">
          <span>
            <BsEnvelope />
          </span>
          <span> Signing out...</span>
        </h1>
      </div>
    </Layout>
  );
}
