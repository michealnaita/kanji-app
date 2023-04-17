import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { default as joinHousehold } from './handlers/joinHousehold/index';
export { default as leaveHousehold } from './handlers/leaveHousehold/index';
export { default as paymentHook } from './handlers/paymentHook/index';
export { default as generateRechargeLink } from './handlers/rechargeLink/index';
export { default as redeemPromo } from './handlers/redeemPromo/index';
export { default as deleteUserAccount } from './handlers/deleteUser/index';
