import bell from './assets/icons/bell.svg';
import wallet from './assets/icons/wallet.svg';
import avatar from './assets/icons/avatar.svg';
export const routes = {
  about: '/about',
  dashboard: '/',
  wallet: '/wallet',
  recharge: '/recharge',
  signout: '/signout',
  signin: '/signin',
  register: '/register',
  notifications: '#',
  services: '/services',
  flutterRedirect: '/flutterwaveRedirect',
  verifyEmail: '/verifyEmail',
  500: 500,
};

export const settings = {
  appName: 'Loscribe',
  landingText: 'Get the lowest subscriptions for your favorite apps',
  services: {
    available: [{ name: 'spotify', price: 4000 }],
    comming_soon: [
      { name: 'netflix', price: 0 },
      { name: 'prime', price: 0 },
    ],
  },
  on_boarding_steps: {
    1: 'Create an account',
    2: 'Load money onto your account using mobile money',
    3: 'Find the service',
    4: 'Find the service',
  },
  support: 'loscribe@gmail.com',
  menu: {
    Profile: { link: '/profile', icon: avatar },
    'Transaction History': { link: '#', icon: wallet },
    Notifications: { link: '#', icon: bell },
  },
};
