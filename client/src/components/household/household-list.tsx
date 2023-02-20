import React from 'react';
import { HouseholdSlim } from '../../utils/types';
import houseIcon from '../../assets/house.svg';
import spotify from '../../assets/spotify.svg';
import netflix from '../../assets/netflix.svg';
import { Link } from 'react-router-dom';

const Item: React.FC<{
  data: HouseholdSlim;
  hideBorder: boolean;
}> = ({ data }) => {
  const services = {
    spotify,
    netflix,
  };
  return (
    <div className="flex justify-between pb-3 pt-1 items-center border-b-2 border-white border-opacity-5">
      <img src={houseIcon} alt="house icon" className=" mt-2" />

      <div className="flex flex-col items-end space-y-1">
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

export default function HouseholdList({ items }: { items: HouseholdSlim[] }) {
  return (
    <ul>
      {items.map((household, i) => (
        <li key={i}>
          <Link to={'/house/' + household.id}>
            <Item data={household} hideBorder={i === items.length - 1} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
