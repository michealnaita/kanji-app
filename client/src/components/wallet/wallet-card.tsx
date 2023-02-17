import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/app';
import { Card } from '../shared';
export default function WalletCard() {
  const navigate = useNavigate();
  const { current_amount } = useApp();
  return (
    <Card
      heading="Your Balance"
      onClick={() => navigate('/recharge')}
      button="recharge"
    >
      <p className="text-4xl text-skin-secondary font-semibold">
        Shs. {current_amount}
      </p>
    </Card>
  );
}
