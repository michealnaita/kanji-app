import React from 'react';
import { Admin } from '../../../utils/types';

const Request: React.FC<Admin['pending_requests'][0]> = ({ email }) => {
  return <div>{email}</div>;
};

export default function PendingRequstsCard() {
  const pending_requests: Admin['pending_requests'] = [
    {
      email: 'jane@gmail.com',
      name: 'Jane',
      service: 'spotify',
      uid: '234567890-',
      at: new Date().toISOString(),
    },
  ];
  return (
    <div className="card">
      {pending_requests.map((request, i) => (
        <Request key={i} {...request} />
      ))}
    </div>
  );
}
