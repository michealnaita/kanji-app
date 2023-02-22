import Layout from '../components/layout';

export default function ErrorPage() {
  return (
    <Layout title="500">
      <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
        <h1 className="text-4xl font-semibold">500</h1>
        <p className="text-xl text-skin-secondary">Something wrong happened</p>
        <a
          className="text-skin-orange text-lg underline"
          href="mailto:littleneck.app@gmail.com"
        >
          Contact Support
        </a>
      </div>
    </Layout>
  );
}
