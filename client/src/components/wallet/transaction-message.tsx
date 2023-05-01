import React from 'react';
import { BsCheck2Circle, BsXCircle } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { settings } from '../../settings';

export default function TransactionMessage({ status }: { status: string }) {
  if (status === 'success')
    return (
      <div className="w-full h-full flex flex-col  justify-center space-y-4">
        <div className="card flex-col center space-y-4 ">
          <BsCheck2Circle color="#9EFC27" size={60} />
          <p className="text-xl text-white">Transaction Successful</p>
        </div>
        <div className="place-self-center text-center space-y-4 text-skin-secondary">
          <p>
            <Link className="text-lg underline" to="/">
              Go Home
            </Link>
          </p>
        </div>
      </div>
    );
  if (status === 'fail')
    return (
      <div className="w-full h-full flex flex-col  justify-center space-y-4">
        <div className="card flex-col center space-y-4 ">
          <BsXCircle color="#EB434D" size={60} />
          <p className="text-xl text-white">Transaction Failed</p>
        </div>
        <div className="place-self-center text-center space-y-4 text-skin-secondary">
          <p>
            <Link className="text-lg underline" to="/">
              Go Home
            </Link>
          </p>
          <p>
            <a
              className="text-lg underline"
              href={'mailto:' + settings.support}
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    );
  return <></>;
}
