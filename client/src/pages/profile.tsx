import ProfileForm from '../components/profile';
import Layout from '../components/layout';
import { useApp } from '../context/app';

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

export default function ProfilePage() {
  const { isLoading } = useApp();
  return (
    <Layout title="Sign In">{isLoading ? <Loader /> : <ProfileForm />}</Layout>
  );
}
