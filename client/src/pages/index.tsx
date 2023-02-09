import React from 'react';
import HouseholdCard from '../components/household/houseHold-card';
import Layout from '../components/layout';
import WalletCard from '../components/wallet/wallet-card';

export default function Home() {
  return (
    <Layout>
      <WalletCard />
      <HouseholdCard />
    </Layout>
  );
}
