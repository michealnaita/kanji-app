import React from 'react';
import { Household } from '../../utils/types';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import spotify from '../../assets/spotify.svg';
import netflix from '../../assets/netflix.svg';
import { Link } from 'react-router-dom';
export default function SearchList({ data }: { data: Household }) {
  const [show, setShow] = React.useState(false);
  const services = {
    spotify,
    netflix,
  };
  const serviceAllowedCount = {
    spotify: 5,
    netflix: 4,
  };
  const details = React.useMemo(
    () => ({
      Service: data.service_membership,
      Persons: data.members.length + ' persons',
      Vacancy:
        serviceAllowedCount[data.service] - data.members.length === 0
          ? 'full'
          : serviceAllowedCount[data.service] -
            data.members.length +
            ' persons',
      Price: 'shs.' + data.price,
    }),
    [data]
  );
  return (
    <div className="card flex flex-col space-y-2">
      <div className="flex items-center justify-between space-y-4">
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
      {show && (
        <>
          <ul>
            {Object.keys(details).map((key, i) => (
              <li className="flex justify-between text-skin-off-white" key={i}>
                <span>{key}</span>
                <span>{details[key as 'Price']}</span>
              </li>
            ))}
          </ul>
          <Link to={'/house/' + data.id}>
            <button className="primary">Join House</button>
          </Link>
        </>
      )}
      <div className="self-end">
        {show ? (
          <button
            className="text-skin-red flex items-center space-x-2"
            onClick={() => setShow(false)}
          >
            <span>collapse</span>
            <span>
              <FaAngleUp />
            </span>
          </button>
        ) : (
          <button
            className="text-skin-cyan  flex items-center space-x-2"
            onClick={() => setShow(true)}
          >
            <span>expand</span>
            <span>
              <FaAngleDown />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
