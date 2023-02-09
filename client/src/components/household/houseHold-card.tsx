import React from 'react';
import { Card } from '../shared';
import { BsPlus } from 'react-icons/bs';

export default function HouseholdCard() {
  return (
    <Card
      heading="Your Households"
      onClick={() => console.log()}
      button={<BsPlus size={40} color="#75B975" />}
    >
      <p className="text-skin-secondary italic">
        you don't have any households, you can browse or create new.{' '}
      </p>
    </Card>
  );
}
