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
import useLeaveHouseholdMutation from '../../api/household/leaveHousehold';
import useJoinHouseholdMutation from '../../api/household/joinHousehold';
import { toast } from 'react-toastify';

export default function Household({ id }: { id: string }) {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useHouseholdQuery(id);
  const l = useLeaveHouseholdMutation();
  const j = useJoinHouseholdMutation();
  const { id: userId } = useApp();
  const [isMember, setMember] = React.useState(false);
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
    if (l.isError) toast.error((l.error as Error).message);
    if (j.isError) toast.error((j.error as Error).message);
  }, [isError, l.isError, j.isError]);
  React.useEffect(() => {
    if (data && userId) {
      setMember(!!data.members.filter((m) => m.id === id).length);
    }
  }, [data]);
  React.useEffect(() => {
    if (j.data) setMember(true);
    if (l.data) setMember(false);
  }, [j.data, l.data]);
  function handleLeaveHousehold() {
    l.mutate({ uid: userId, household: id });
  }
  function handleJoinHousehold() {
    j.mutate({ household: id });
  }
  return (
    <>
      {isLoading ? (
        <HouseholdLoader />
      ) : (
        data && (
          <Card
            title={data.name}
            button={
              isMember ? (
                <button
                  className="danger self-center"
                  onClick={handleLeaveHousehold}
                >
                  Leave House
                </button>
              ) : (
                <button
                  className="primary self-center"
                  onClick={handleJoinHousehold}
                  disabled={l.isLoading || j.isLoading || isLoading}
                >
                  Join House
                </button>
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
                    <p>{isMember ? 'You' : member.firstname}</p>
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
