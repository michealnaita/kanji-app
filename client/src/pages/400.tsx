import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout';

export default function ErrorPage() {
  let [searchParams, _] = useSearchParams();
  const message = searchParams.get('message');
  const code = searchParams.get('code');
  return (
    <Layout title="400">
      <div className="w-full h-full flex flex-col  justify-center space-y-4">
        <div className="card flex-col center space-y-4 ">
          <h1 className="text-4xl font-semibold">400</h1>
          <p className="text-xl text-skin-secondary">Bad Request</p>
          <p className="text-xl text-skin-secondary">{code}</p>
          <p className="text-xl text-skin-secondary">{message}</p>
        </div>
        <div className="place-self-center  underline text-center space-y-4">
          <p>
            <a href="mailto:littleneck.app@gmail.com">Contact Support</a>
          </p>
          <p>
            <Link to="/">Go Home</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
