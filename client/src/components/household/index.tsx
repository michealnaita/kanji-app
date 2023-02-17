import React from 'react';
import { HouseholdMember } from '../../utils/types';
import spotify from '../../assets/spotify.svg';
import netflix from '../../assets/netflix.svg';
import { useApp } from '../../context/app';
import { useHouseholdQuery } from '../../api/getHousehold';
import { useNavigate } from 'react-router-dom';
import HouseholdLoader from './household-loader';
import { NotFoundError } from '../../utils/errors';
import Card from '../shared/cards/card-two';

export default function Household({ id }: { id: string }) {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useHouseholdQuery(id);
  const { id: userId } = useApp();
  const services = {
    spotify,
    netflix,
  };
  const details = React.useMemo(
    () =>
      data
        ? {
            Service: data.service_membership,
            Persons: data.members.length + ' persons',
            Vacancy: 4 - data.members.length + ' persons',
            Price: 'shs.' + data.price,
          }
        : null,
    [data]
  );
  React.useEffect(() => {
    if (isError) {
      if (error instanceof NotFoundError) {
        navigate('/400');
      } else {
        navigate('/500');
      }
    }
  }, [isError]);
  return (
    <>
      {isLoading ? (
        <HouseholdLoader />
      ) : (
        data && (
          <Card
            title={data.name}
            button={
              data!.members.filter((m) => m.id === userId).length ? (
                <button className="danger self-center">Leave House</button>
              ) : (
                <button className="primary self-center">Join House</button>
              )
            }
          >
            <div className="flex justify-between items-center">
              <img
                src={services[data!.service as 'netflix' | 'spotify']}
                alt="house icon"
              />
              <button className="text-skin-lime">invite</button>
            </div>
            <div>
              <p className="text-skin-secondary font-semibold">Details</p>
              <ul>
                {Object.keys(details!).map((key, i) => (
                  <li
                    className="flex justify-between text-skin-off-white"
                    key={i}
                  >
                    <p>{key}</p>
                    <p>{details![key as 'Price']}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-skin-secondary font-semibold">Members</p>
              <ul>
                {data!.members.map((member: HouseholdMember, i) => (
                  <li
                    className="flex justify-between text-skin-off-white"
                    key={i}
                  >
                    <p>{userId === member.id ? 'You' : member.firstname}</p>
                    <p className="text-skin-orange">{member.phone}</p>
                  </li>
                ))}
              </ul>
            </div>
            {data!.logins && (
              <div>
                <p className="text-skin-secondary font-semibold">Logins</p>
                <ul>
                  {Object.keys(data!.logins!).map((k, i) => (
                    <li
                      className="flex justify-between text-skin-off-white"
                      key={i}
                    >
                      <p>{k}</p>
                      <p className="text-skin-orange">
                        {data!.logins && data!.logins[k as 'email']}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="italics text-skin-secondary text-sm">
              note: your subscription will begin when house is full with 4
              memebers and the logins will be reveiled
            </p>
          </Card>
        )
      )}
    </>
  );
}
