import React from 'react';
import { Disclosure } from '@headlessui/react';
import { Service } from '../../../utils/types';
import { TfiAngleDown } from 'react-icons/tfi';
import cn from 'classnames';
import { formatPrice, getBrandLogo } from '../../../utils/utils';

export default function ServiceCard({
  membership,
  id,
  price,
  renewal,
}: Service) {
  const details: { [field: string]: string } = React.useMemo(
    () => ({
      Membership: membership,
      Price: formatPrice(price),
      Renewal: renewal,
    }),
    []
  );
  return (
    <Disclosure>
      {({ open }) => (
        <div className="card space-y-8">
          <div className="flex justify-between">
            <span>
              <img src={getBrandLogo(id)} width="100" alt={id} />
            </span>
            <Disclosure.Button>
              <TfiAngleDown
                color="white"
                size="20"
                className={cn({ 'rotate-180': open })}
              />
            </Disclosure.Button>
          </div>
          <Disclosure.Panel className="flex flex-col space-y-8">
            <div className="space-y-1 text-sm">
              {Object.keys(details).map((field, i) => (
                <div key={i} className="w-full flex justify-between">
                  <p>{field}:</p>
                  <p>{details[field]}</p>
                </div>
              ))}
            </div>
            <button className="underline place-self-center">
              Extend subscription
            </button>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
