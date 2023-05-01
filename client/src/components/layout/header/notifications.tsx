import { Popover } from '@headlessui/react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { routes } from '../../../settings';
import { UserNotification } from '../../../utils/types';

type headerType = {
  username?: string;
  notifications?: number;
  isAuthenticated: boolean;
};

export default function NotifcationsWrapper({
  children,
  notifications,
}: {
  children: any;
  notifications?: UserNotification[];
}) {
  return (
    <Popover>
      <div className="relative">
        <Popover.Button>{children}</Popover.Button>
        <Popover.Panel className="flex flex-col text-skin-dark menu-card">
          <div className="menu-container space-y-6">
            <h1 className="font-semibold">Notifications</h1>
            {notifications && notifications.length ? (
              <>
                <>
                  {notifications.slice(0, 3).map((n, i) => (
                    <div key={i} className="flex flex-col">
                      <p>{n.message}</p>
                      <span className="text-xs text-skin-secondary">
                        {moment(n.at).fromNow()}
                      </span>
                    </div>
                  ))}
                </>
                <p>
                  <Link to={routes.notifications} className="underline">
                    All Notifications
                  </Link>
                </p>
              </>
            ) : (
              <p>No new notifications</p>
            )}
          </div>
        </Popover.Panel>
      </div>
    </Popover>
  );
}
