import React, { Fragment } from 'react';
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
import DialogPrompt from './dialog';
import { Transition } from '@headlessui/react';
import { useAuth } from '../../context/auth';

export default function Household({ id }: { id: string }) {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useHouseholdQuery(id);
  const l = useLeaveHouseholdMutation();
  const j = useJoinHouseholdMutation();
  const { id: userId } = useApp();
  const { isAuthenticated } = useAuth();
  const [isMember, setMember] = React.useState<boolean>(false);
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [showToolTip, setShow] = React.useState<boolean>(false);
  const [action, setAction] = React.useState<'leave' | 'join' | 'auth'>(
    'leave'
  );
  const services = {
    spotify,
    netflix,
  };
  const serviceAllowedCount = {
    netflix: 4,
    spotify: 5,
  };
  const details = React.useMemo(
    () =>
      data
        ? {
            Service: data.service_membership,
            Persons: data.members.length + ' persons',
            Vacancy:
              serviceAllowedCount[data.service] - data.members.length === 0
                ? 'full'
                : serviceAllowedCount[data.service] -
                  data.members.length +
                  ' persons',
            Price: 'shs.' + data.price,
          }
        : null,
    [data]
  );
  React.useEffect(() => {
    if (isError) {
      if (error instanceof NotFoundError) {
        navigate('/404');
      } else {
        navigate('/500');
      }
    }
    if (l.isError) toast.error((l.error as Error).message);
    if (j.isError) toast.error((j.error as Error).message);
  }, [isError, l.isError, j.isError]);
  React.useEffect(() => {
    if (data && userId) {
      setMember(!!data.members.filter((m) => m.id === userId).length);
    }
  }, [data]);
  React.useEffect(() => {
    if (j.data && !l.data) {
      toast.success('Successfully joined house');
      setMember(true);
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    }
    if (l.data && !j.data) {
      toast.success('Successfully left house');
      setMember(false);
    }
    l.data && j.data && toast.warn('Try again later');
  }, [j.data, l.data]);
  const handlers = React.useMemo(
    () => ({
      leave: () => {
        setOpen(false);
        j.data
          ? toast.warn('Wait some time before you can leave house')
          : l.mutate({ household: id });
      },
      join: () => {
        setOpen(false);
        l.data
          ? toast.warn('Wait some time before you can join house again')
          : j.mutate({ household: id });
      },
      auth: () => {
        const s = new URLSearchParams();
        s.set('from', location.pathname);
        navigate('/signin?' + s.toString());
      },
    }),
    [j.data, l.data]
  );
  function handleShare() {
    const shareData = {
      title: 'Littleneck App',
      text: 'Join ' + data?.name,
      url: window.location.href,
    };
    navigator.share && navigator.share(shareData);
  }
  return (
    <>
      <DialogPrompt
        isOpen={isOpen}
        proceed={handlers[action]}
        closeModal={() => setOpen(false)}
        action={action}
      />
      {isLoading ? (
        <HouseholdLoader />
      ) : (
        data && (
          <Card
            title={data.name}
            button={
              isMember ? (
                <button
                  onClick={() => {
                    setAction('leave');
                    setOpen(true);
                  }}
                  className={
                    l.isLoading
                      ? 'danger self-center disabled cursor-not-allowed animate-pulse'
                      : 'danger self-center'
                  }
                  disabled={l.isLoading}
                >
                  {l.isLoading ? 'please wait...' : 'Leave House'}
                </button>
              ) : (
                <button
                  className={
                    j.isLoading
                      ? 'primary self-center disabled cursor-not-allowed animate-pulse'
                      : 'primary self-center'
                  }
                  onClick={() => {
                    if (isAuthenticated) {
                      setAction('join');
                      setOpen(true);
                    } else {
                      setAction('auth');
                      setOpen(true);
                    }
                  }}
                  disabled={j.isLoading}
                >
                  {j.isLoading ? 'please wait...' : 'Join House'}
                </button>
              )
            }
          >
            <div className="flex justify-between items-center">
              <img
                src={services[data!.service as 'netflix' | 'spotify']}
                alt="house icon"
              />
              <div className="relative">
                <Transition as={Fragment} show={showToolTip}>
                  <p className="tool-tip">
                    Invite friends, to fill up house quickly
                  </p>
                </Transition>

                <button className="text-skin-lime" onClick={handleShare}>
                  invite
                </button>
              </div>
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
                {data.members.length ? (
                  data!.members.map((member: HouseholdMember, i) => (
                    <li
                      className="flex justify-between text-skin-off-white"
                      key={i}
                    >
                      <p>{userId === member.id ? 'You' : member.firstname}</p>
                      <p className="text-skin-orange">{member.phone}</p>
                    </li>
                  ))
                ) : (
                  <li>
                    <p>no members yet</p>
                  </li>
                )}
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
