import { BsPlus } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/logo.svg';
type headerType = {
  username?: string;
  amount?: number;
  isAuthenticated: boolean;
};
export default function Header({
  username,
  amount,
  isAuthenticated,
}: headerType) {
  function openWallet() {
    //
  }
  return (
    <div className="px-6 py-4 container ">
      <div className=" items-center pb-2 flex justify-between border-b-2 border-neutral-800">
        <Link to="/">
          <img src={Logo} alt="logo" width={35} />
        </Link>
        {isAuthenticated && (
          <div className="flex flex-col items-end">
            <p className="font-semibold text-skin-cyan text-lg">{username}</p>
            <p className="flex items-center space-x-2 text-base">
              <span className="text-white opacity-50 ">shs. {amount} </span>
              <span onClick={openWallet}>
                <BsPlus size={28} color="#75B975" />
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
