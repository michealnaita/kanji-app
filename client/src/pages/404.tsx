import { Link } from 'react-router-dom';
import Layout from '../components/layout';

export default function ErrorPage() {
  return (
    <Layout>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold">500</h1>
        <p className="text-xl text-skin-secondary">Something wrong happened</p>
        <Link className="text-skin-orange text-lg underline" to="/">
          Go Home
        </Link>
      </div>
    </Layout>
  );
}
