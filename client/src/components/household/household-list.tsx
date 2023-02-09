import React from 'react';
import { Household } from '../../utils/types';
import houseIcon from '../../assets/house.svg';
import spotify from '../../assets/spotify.svg';
import netflix from '../../assets/netflix.svg';

const Item: React.FC<{
  data: Household;
  hideBorder: boolean;
  onClick: (id: string) => void;
}> = ({ data }) => {
  const services = {
    spotify,
    netflix,
  };
  return (
    <div className="flex justify-between py-4 items-center border-b-2 border-white border-opacity-5">
      <img src={houseIcon} alt="house icon" className=" mt-2" />

      <div className="flex flex-col items-end space-y-2 ">
        <p className="font-patrick-hand text-skin-secondary font-semibold text-2xl">
          {data.name}
        </p>
        <div>
          <img
            src={services[data.service as 'netflix' | 'spotify']}
            alt="house icon"
          />
        </div>
      </div>
    </div>
  );
};

export default function HouseholdList({ items }: { items: Household[] }) {
  return (
    <ul>
      {items.map((household, i) => (
        <li key={i}>
          <Item
            data={household}
            hideBorder={i === items.length - 1}
            onClick={console.log}
          />
        </li>
      ))}
    </ul>
  );
}
