import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout';
import { useApp } from '../context/app';

export default function ErrorPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated]);
  return (
    <Layout>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold">500</h1>
        <p className="text-xl text-skin-secondary">Something wrong happened</p>
        <a
          className="text-skin-orange text-lg underline"
          href="mailto:michealnaita15@gmail.com"
        >
          Contact Support
        </a>
      </div>
    </Layout>
  );
}
