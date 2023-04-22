import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignInForm from '../components/auth/signin';
import Layout from '../components/layout';
import { useAuth } from '../context/auth';

export default function HouseholdPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, []);
  return (
    <Layout title="Sign In">
      <SignInForm />
    </Layout>
  );
}
