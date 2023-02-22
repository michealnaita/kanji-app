import { Menu } from '@headlessui/react';
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
            <Menu>
              <Menu.Button>
                <p className="font-semibold text-skin-cyan text-lg">
                  {username}
                </p>
              </Menu.Button>
              <Menu.Items className="absolute bg-skin-secondary shadow-lg origin-top-right divide-y divide-[rgba(255,255,255,0.1)] py-6 z-10 mt-8 w-56 rounded-lg flex flex-col space-y-4">
                <Menu.Item>
                  {({ active }) => (
                    <button className="hover:text-skin-orange text-skin-secondary text-right px-4">
                      <Link to="/promo">Use Promo</Link>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button className="hover:text-skin-orange text-skin-secondary text-right pt-4 px-4">
                      <a href="mailto:littleneck.app@gmail.com">Help</a>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button className="hover:text-skin-orange text-skin-secondary text-right pt-4 px-4">
                      <Link to="/signout">Log out</Link>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
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
