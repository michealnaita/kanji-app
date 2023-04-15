import React from 'react';
import Layout from '../components/layout';
import { BsEnvelope } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import flutterwaveLogo from '../assets/flutterwave-logo.svg';

export default function FlutterWaveRedirect() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const url = new URLSearchParams(window.location.search).get('url');
    if (url) {
      setTimeout(() => navigate(url), 3000);
    }
  }, []);
  return (
    <Layout title="Verify Email" hide className="px-6 center space-y-10">
      <div className="w-full  flex flex-col items-center justify-center space-y-3 card animate-pulse">
        <div className="flex items-center space-x-4 text-2xl font-semibold">
          <img src={flutterwaveLogo} alt="" />
        </div>
        <p className="text-base text-center">
          Redirecting you to secure payment platform.....
        </p>
      </div>
    </Layout>
  );
}
