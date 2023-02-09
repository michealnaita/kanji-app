import React from 'react';
import { Card } from '../shared';
export default function WalletCard() {
  return (
    <Card
      heading="Wallet"
      onClick={() => console.log('clicked')}
      button="recharge"
    >
      <p className="text-4xl text-skin-secondary font-semibold">Shs. 15,000</p>
    </Card>
  );
}
