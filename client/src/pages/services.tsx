import React from 'react';
import Layout from '../components/layout';
import ServiceList from '../components/services/browse/service-list';
import { useApp } from '../context/app';

const Loader = () => {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="loader-text"></div>
        <div className="loader-text"></div>
        <div className="loader-card"></div>
      </div>
      <div className="space-y-4">
        <div className="loader-text"></div>
        <div className="loader-card"></div>
        <div className="loader-card"></div>
      </div>
    </div>
  );
};
export default function ServicePage() {
  const { isLoading } = useApp();
  return (
    <Layout title="Browse">{isLoading ? <Loader /> : <ServiceList />}</Layout>
  );
}
