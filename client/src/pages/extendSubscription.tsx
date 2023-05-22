import React from 'react';
import Layout from '../components/layout';
import ExtendSubscriptionCard from '../components/wallet/extendSubscription';
import { useApp } from '../context/app';
import { useSearchParams } from 'react-router-dom';

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
export default function ExtendSubscriptionPage() {
  const { isLoading } = useApp();
  const [params] = useSearchParams();
  const service_id = React.useMemo(() => params.get('service_id'), []);
  return (
    <Layout title="Extend Subscription">
      {isLoading ? (
        <Loader />
      ) : (
        <ExtendSubscriptionCard service_id={service_id!} />
      )}
    </Layout>
  );
}
