import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/register';
import Layout from '../components/layout';
import { useApp } from '../context/app';

export default function HouseholdPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, []);
  return (
    <Layout title="Register">
      <RegisterForm />
    </Layout>
  );
}
