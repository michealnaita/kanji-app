import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAdmin from '../../../context/admin';
import { Admin } from '../../../utils/types';

const Request: React.FC<Admin['pending_requests'][0]> = ({ email, uid }) => {
  const navigate = useNavigate();
  return (
    <div
      className="text-skin-secondary"
      onClick={() => navigate('request/' + uid)}
    >
      {email}
    </div>
  );
};

export default function PendingRequstsCard() {
  const { pending_requests } = useAdmin();
  return (
    <div className="space-y-4">
      <h1>Pending Requests</h1>
      <div className="card flex flex-col space-y-4s">
        <>
          {pending_requests.map((request, i) => (
            <Request key={i} {...request} />
          ))}
        </>
        <button className="place-self-center underline text-sm">
          show more{' '}
        </button>
      </div>
    </div>
  );
}
