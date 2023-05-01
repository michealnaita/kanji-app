import { useParams } from 'react-router-dom';
import Layout from '../components/layout';
import PendingRequest from '../components/admin/pendingRequests/page';
import useAdmin from '../context/admin';
const Loader = () => {
  return (
    <>
      <div className="space-y-16">
        <div className="space-y-4">
          <div className="loader-text"></div>
          <div className="loader-text-long"></div>
          <div className="loader-text-long"></div>
          <div className="loader-text-long"></div>
        </div>
        <div className="space-y-4">
          <div className="loader-text"></div>
          <div className="loader-text-long"></div>
          <div className="loader-text-long"></div>
          <div className="loader-text-long"></div>
          <div className="loader-text-long"></div>
        </div>
      </div>
    </>
  );
};

export default function PendingRequestPage() {
  const { uid } = useParams();
  const { isLoading } = useAdmin();
  return (
    <Layout title="Household">
      {isLoading ? <Loader /> : <PendingRequest uid={uid!} />}
    </Layout>
  );
}
