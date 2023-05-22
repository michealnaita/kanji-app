import Layout from '../components/layout';

export default function UnavailablePage() {
  return (
    <Layout title="Unavailable">
      <div className="w-full h-full flex flex-col  justify-center space-y-4">
        <div className="card flex-col center space-y-4 ">
          <h1 className="text-2xl font-semibold">Unavailable</h1>
          <p className="text-xl text-skin-secondary">
            Sorry but loscribe is unavailable for your country.
          </p>
        </div>
      </div>
    </Layout>
  );
}
