import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/app';
import { formatPrice } from '../../utils/utils';
export default function WalletCard() {
  const navigate = useNavigate();
  const { current_amount } = useApp();
  return (
    <div className="space-y-4">
      <h1 className="font-semibold">Wallet</h1>
      <div className="card space-y-7 text-center">
        <p className="text-4xl text-skin-secondary font-semibold">
          UGX {formatPrice(current_amount)}
        </p>
        <button
          className="text-skin-secondary text-center underline"
          onClick={() => navigate('/recharge')}
        >
          Recharge
        </button>
      </div>
    </div>
  );
}
