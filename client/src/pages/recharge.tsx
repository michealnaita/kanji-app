import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout';
import RechargeCard from '../components/wallet/recharge-card';
import TransactionMessage from '../components/wallet/transaction-message';

export default function RechargePage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const transaction = searchParams.get('transaction');
  return (
    <Layout>
      {transaction ? (
        <TransactionMessage status={transaction} />
      ) : (
        <RechargeCard />
      )}
    </Layout>
  );
}
