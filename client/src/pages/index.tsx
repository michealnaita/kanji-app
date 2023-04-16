import Layout from '../components/layout';
import ServiceCards from '../components/services/dashboard';
import WalletCard from '../components/wallet/wallet-card';

export default function Home() {
  return (
    <Layout title="Dashboard" className="space-y-10 !pb-10">
      <WalletCard />
      <ServiceCards />
    </Layout>
  );
}
