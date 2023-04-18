import { Link } from 'react-router-dom';
import Layout from '../components/layout';

export default function ErrorPage() {
  return (
    <Layout title="404">
      <div className="w-full h-full flex flex-col  justify-center space-y-4">
        <div className="card flex-col center space-y-4 ">
          <h1 className="text-4xl font-semibold">404</h1>
          <p className="text-xl text-skin-secondary">Page Not Found</p>
        </div>
        <div className="place-self-center text-center space-y-4">
          <p>
            <Link className=" underline" to="/">
              Go Home
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
