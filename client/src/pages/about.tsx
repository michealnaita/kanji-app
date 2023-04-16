import React from 'react';
import Layout from '../components/layout';
import spotify from '../assets/spotify.svg';
import netflix from '../assets/netflix.svg';
import prime from '../assets/prime.svg';
import landingImage from '../assets/landing-image.jpg';
import logo from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { routes, settings } from '../settings';
import { Disclosure } from '@headlessui/react';
const services: { [s: string]: any } = {
  spotify,
  netflix,
  prime,
};
const Details: React.FC = () => {
  return (
    <Disclosure as="div" className="text-center space-y-10">
      {({ open }) => (
        <>
          <Disclosure.Panel className="space-y-16 flex   flex-col items-center text-center">
            <div className="space-y-4 align-center">
              <h1 className="font-semibold text-white">Available</h1>
              <>
                {settings.services.available.map((service, i) => (
                  <div key={i} className="space-y-2">
                    <img src={services[service.name]} alt="" width="100px" />
                    <p className="text-skin-gray">at UGX {service.price}</p>
                  </div>
                ))}
              </>
            </div>
            <div className="space-y-7 align-center">
              <h1 className="font-semibold">Comming Soon</h1>
              <>
                {settings.services.comming_soon.map((service, i) => (
                  <div key={i}>
                    <img src={services[service.name]} alt="" width="100px" />
                  </div>
                ))}
              </>
            </div>
            <div className="space-y-7 text-center">
              <h1 className="font-semibold text-white">All You need to do</h1>
              <>
                {Object.values(settings.on_boarding_steps).map((step, i) => (
                  <div key={i} className="space-y-2 flex flex-col">
                    <span className="center w-10 h-10 rounded-full bg-skin-lime bg-opacity-10 text-white place-self-center">
                      {i + 1}
                    </span>
                    <p className="text-skin-gray"> {step}</p>
                  </div>
                ))}
              </>
            </div>
          </Disclosure.Panel>
          <Disclosure.Button className="underline">
            {open ? 'show less' : 'show more'}
          </Disclosure.Button>
        </>
      )}
    </Disclosure>
  );
};
export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <Layout title="About" hide className="!p-0">
      <div className="w-full h-max landing-gradient max-h-[600px] overflow-hidden relative">
        <img src={landingImage} alt="landing image" width="100%" />
        <div className="absolute top-1/2 left-1/2 z-20 transfrom -translate-x-1/2 -translate-y-1/2">
          <img src={logo} alt="logo" />
        </div>
      </div>
      <div className="bg-skin-primary align-center gap-4 space-y-4 px-6 py-10">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-center text-white">
            {settings.appName}
          </h1>
          <p className="text-skin-gray text-center">{settings.landingText}</p>
        </div>

        <Details />

        <button
          className="primary"
          onClick={() => navigate(routes.signin + window.location.search)}
        >
          Login
        </button>

        <button
          className="secondary"
          onClick={() => navigate(routes.register + window.location.search)}
        >
          Sign Up
        </button>
      </div>
    </Layout>
  );
}
