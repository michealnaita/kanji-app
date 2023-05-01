import { Link } from 'react-router-dom';
import { useApp } from '../../../context/app';
import { routes } from '../../../settings';
import ServiceCard from './service-card';

export default function ServiceCards() {
  const { services } = useApp();
  return (
    <div className="space-y-16 flex flex-col ">
      <>
        <div className="space-y-4">
          <h1 className="text-white font-semibold">Services</h1>
          {services && !!services.length ? (
            services.map((service, i) => <ServiceCard key={i} {...service} />)
          ) : (
            <p className="text-skin-secondary text-center">
              You are not currently subscribed to any services
            </p>
          )}
        </div>
      </>
      <p className="underline place-self-center mt-10">
        <Link to={routes.services}>
          {services && services.length ? 'Add Services' : 'Browse Services'}
        </Link>
      </p>
    </div>
  );
}
