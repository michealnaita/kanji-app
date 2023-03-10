import React from 'react';
import { Card } from '../shared';
import { BsPlus } from 'react-icons/bs';
import { useApp } from '../../context/app';
import HouseholdList from './household-list';

export default function HouseholdCard() {
  const { households } = useApp();
  return (
    <Card
      heading="Your Households"
      onClick={() => console.log()}
      button={<BsPlus size={40} color="#75B975" />}
    >
      {households.length ? (
        <HouseholdList items={households} />
      ) : (
        <p className="text-skin-secondary italic">
          you don't have any households, you can browse or create new.{' '}
        </p>
      )}
    </Card>
  );
}
