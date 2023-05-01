import Layout from '../components/layout';
import { settings } from '../settings';

export default function ErrorPage() {
  return (
    <Layout title="500">
      <div className="w-full h-full flex flex-col  justify-center space-y-4">
        <div className="card flex-col center space-y-4 ">
          <h1 className="text-4xl font-semibold">500</h1>
          <p className="text-lg text-center text-skin-secondary">
            Something wrong happened
          </p>
        </div>
        <div className="place-self-center text-center space-y-4 ">
          <p>
            <a className="underline" href={'mailto:' + settings.support}>
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
