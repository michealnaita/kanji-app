import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout';

export default function ErrorPage() {
  let [searchParams, _] = useSearchParams();
  const message = searchParams.get('message');
  const code = searchParams.get('code');
  return (
    <Layout>
      <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
        <h1 className="text-4xl font-semibold">400</h1>
        <p className="text-xl text-skin-secondary">
          {message ? message : 'Bad Request'}
        </p>
        <p className="text-xl text-skin-secondary">
          {code ? code : 'Bad Request'}
        </p>
        <a
          className="text-skin-orange text-lg underline"
          href="mailto:littleneck.app@gmail.com"
        >
          Contact Support
        </a>
        <a
          className="text-skin-orange text-lg underline"
          href="mailto:littleneck.app@gmail.com"
        >
          Go Home
        </a>
      </div>
    </Layout>
  );
}
