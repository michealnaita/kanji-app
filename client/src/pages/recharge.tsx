import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout';
import RechargeCard from '../components/wallet/recharge-card';
import TransactionMessage from '../components/wallet/transaction-message';
import { useApp } from '../context/app';

const Loader = () => {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="loader-text mb-10"></div>
        <div className="loader-text"></div>
        <div className="loader-card"></div>
      </div>
    </div>
  );
};
export default function RechargePage() {
  const { isLoading } = useApp();
  let [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  return (
    <Layout title="Recharge">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {status ? <TransactionMessage status={status} /> : <RechargeCard />}
        </>
      )}
    </Layout>
  );
}
