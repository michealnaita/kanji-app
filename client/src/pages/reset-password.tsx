import React from 'react';
import { useNavigate } from 'react-router-dom';
import ResetPasswordForm from '../components/auth/reset-password';
import Layout from '../components/layout';
import { useAuth } from '../context/auth';

export default function HouseholdPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, []);
  return (
    <Layout title="Reset Password">
      <ResetPasswordForm />
    </Layout>
  );
}
