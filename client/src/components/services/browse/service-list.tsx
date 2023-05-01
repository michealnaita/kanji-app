import React from 'react';
import ServiceCard from '.';
import { settings } from '../../../settings';
import Card from '../../shared/cards/card-two';

export default function ServiceList() {
  return (
    <Card title="Browse services" className="space-y-16">
      <div className="space-y-4">
        <h1 className="font-semibold">Available</h1>
        {settings.services.available.map(({ name, price }, i) => (
          <ServiceCard key={i} id={name} price={price} available />
        ))}
      </div>
      <div className="space-y-4">
        <h1 className="font-semibold">Coming Soon</h1>
        {settings.services.comming_soon.map(({ name }, i) => (
          <ServiceCard key={i} id={name} />
        ))}
      </div>
    </Card>
  );
}
