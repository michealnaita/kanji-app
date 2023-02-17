import { QueryFunctionContext, useMutation } from 'react-query';

function getLink(amount: number): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('https://www.google.com'), 3000);
  });
}
export default function useRechargeMutation() {
  return useMutation(getLink);
}
