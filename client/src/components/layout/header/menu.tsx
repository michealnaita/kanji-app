import { Popover } from '@headlessui/react';
import { Link } from 'react-router-dom';
import supportIcon from '../../../assets/icons/support.svg';
import { settings } from '../../../settings';

const menu: { [item: string]: { link: string; icon: string } } = settings.menu;
export default function MenuWrapper({ children }: { children: any }) {
  return (
    <Popover>
      <div className="relative">
        <Popover.Button>{children}</Popover.Button>
        <Popover.Panel className="flex flex-col text-skin-dark menu-card">
          <div className="menu-container space-y-20">
            <div className="space-y-6">
              {Object.keys(menu).map((item, i) => {
                const { link, icon } = menu[item];
                return (
                  <div key={i}>
                    <Link to={link} className="menu-item">
                      <span>
                        <img src={icon} />
                      </span>
                      <span>{item}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
            <div>
              <a href={'mailto:' + settings.support} className="menu-item">
                <img src={supportIcon} />
                <span>support</span>
              </a>
            </div>
          </div>
        </Popover.Panel>
      </div>
    </Popover>
  );
}
