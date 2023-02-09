import React from 'react';
import { useApp } from '../../context/app';
import { Card } from '../shared';
export default function WalletCard() {
  const { current_amount } = useApp();
  return (
    <Card
      heading="Wallet"
      onClick={() => console.log('clicked')}
      button="recharge"
    >
      <p className="text-4xl text-skin-secondary font-semibold">
        Shs. {current_amount}
      </p>
    </Card>
  );
}
