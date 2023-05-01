import { useParams } from 'react-router-dom';
import Layout from '../components/layout';
import PendingRequest from '../components/admin/pendingRequests/page';

export default function PendingRequestPage() {
  const { uid } = useParams();
  return (
    <Layout title="Household">
      <PendingRequest uid={uid!} />
    </Layout>
  );
}
