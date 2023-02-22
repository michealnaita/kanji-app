import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout';
import PromoCard from '../components/promo/promo-card';
export default function RechargePage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status');
  return (
    <Layout title="Promo">
      <PromoCard />
    </Layout>
  );
}
