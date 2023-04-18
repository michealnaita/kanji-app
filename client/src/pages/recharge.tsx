import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout';
import RechargeCard from '../components/wallet/recharge-card';
import TransactionMessage from '../components/wallet/transaction-message';

export default function RechargePage() {
  let [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  return (
    <Layout title="Recharge">
      {status ? <TransactionMessage status={status} /> : <RechargeCard />}
    </Layout>
  );
}
