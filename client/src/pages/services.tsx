import React from 'react';
import Layout from '../components/layout';
import ServiceList from '../components/services/browse/service-list';

export default function ServicePage() {
  return (
    <Layout title="Browse">
      <ServiceList />
    </Layout>
  );
}
