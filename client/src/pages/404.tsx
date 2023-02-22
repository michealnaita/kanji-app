import { Link } from 'react-router-dom';
import Layout from '../components/layout';

export default function ErrorPage() {
  return (
    <Layout title="404">
      <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
        <h1 className="text-4xl font-semibold">404</h1>
        <p className="text-xl text-skin-secondary">Not Found</p>
        <Link className="text-skin-orange text-lg underline" to="/">
          Go Home
        </Link>
      </div>
    </Layout>
  );
}
