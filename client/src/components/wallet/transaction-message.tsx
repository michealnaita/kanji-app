import React from 'react';
import { BsCheck2Circle, BsXCircle } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function TransactionMessage({ status }: { status: string }) {
  if (status === 'success')
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
        <BsCheck2Circle color="#75B975" size={60} />
        <p className="text-xl text-skin-secondary">Transaction Successful</p>
        <Link className="text-skin-orange text-lg underline" to="/">
          Go Home
        </Link>
      </div>
    );
  if (status === 'fail')
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
        <BsXCircle color="#EB434D" size={60} />
        <p className="text-xl text-skin-secondary">Transaction Failed</p>
        <Link className="text-skin-orange text-lg underline" to="/">
          Go Home
        </Link>
        <a
          className="text-skin-orange text-lg underline"
          href="mailto:michealnaita15@gmail.com"
        >
          Contact support
        </a>
      </div>
    );
  return <></>;
}
