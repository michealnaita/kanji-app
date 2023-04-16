import { Popover } from '@headlessui/react';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/logo.svg';
import bellIcon from '../../../assets/icons/bell-light.svg';
import { routes } from '../../../settings';
import { RxAvatar } from 'react-icons/rx';
import NotifcationsWrapper from './notifications';
import MenuWrapper from './menu';

type headerType = {
  username?: string;
  notifications?: string[];
  isAuthenticated: boolean;
};

export default function Header({
  username,
  isAuthenticated,
  notifications,
}: headerType) {
  return (
    <div className="px-6 py-4 container ">
      <div className=" items-center pb-2 flex justify-between">
        {isAuthenticated ? (
          <Link to="/">
            <img src={Logo} alt="logo" width={20} />
          </Link>
        ) : (
          <a href="/">
            <img src={Logo} alt="logo" width={20} />
          </a>
        )}
        {isAuthenticated && (
          <div className="flex space-x-4 items-center">
            <NotifcationsWrapper notifications={notifications}>
              <div className="relative center w-8 h-8">
                <img src={bellIcon} alt="" />
                {notifications && notifications.length ? (
                  <div className="absolute w-2 h-2 rounded-full bg-skin-lime top-0 right-0" />
                ) : null}
              </div>
            </NotifcationsWrapper>
            <p className="font-semibold text-skin-lime ">{username}</p>
            <MenuWrapper>
              <RxAvatar color="white" size="35" />
            </MenuWrapper>
          </div>
        )}
      </div>
    </div>
  );
}
