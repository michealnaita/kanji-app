import Layout from '../components/layout';
import ServiceCards from '../components/services/dashboard';
import WalletCard from '../components/wallet/wallet-card';
import { useApp } from '../context/app';

const Loader = () => {
  return (
    <>
      <div className="space-y-4">
        <div className="loader-text"></div>
        <div className="loader-card"></div>
      </div>
      <div className="space-y-4">
        <div className="loader-text"></div>
        <div className="loader-card"></div>
        <div className="loader-card"></div>
      </div>
    </>
  );
};

export default function Home() {
  const { isLoading } = useApp();
  return (
    <Layout title="Dashboard" className="space-y-10 !pb-10">
      {isLoading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <WalletCard />
          <ServiceCards />
        </>
      )}
    </Layout>
  );
}
