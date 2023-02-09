import React from 'react';
import { Link } from 'react-router-dom';
import HouseholdCard from '../components/household/houseHold-card';
import Layout from '../components/layout';
import WalletCard from '../components/wallet/wallet-card';

export default function Home() {
  return (
    <Layout>
      <WalletCard />
      <HouseholdCard />
      <Link to="/search" className="self-center">
        <button className="text-skin-lime font-semibold underline-offset-2 underline self-center">
          Browse Households
        </button>
      </Link>
    </Layout>
  );
}
