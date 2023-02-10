import React from 'react';
import Household from '../components/household';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout';

export default function HouseholdPage() {
  const { householdId } = useParams();
  return (
    <Layout>
      <Household id={householdId!} />
    </Layout>
  );
}
