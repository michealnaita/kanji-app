import React from 'react';
import Layout from '../components/layout';
import spotify from '../assets/spotify.svg';
import netflix from '../assets/netflix.svg';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <Layout title="About">
      <div className="flex flex-col justify-center space-y-8 p-8">
        <h1 className="text-2xl font-bold text-center">
          Welcome to littleneck
        </h1>
        <p className="text-skin-secondary text-2xl">
          Get connected to people who you can share your netflix or spotify bill
          with.
        </p>
        <div className="text-xl space-y-2">
          <p className="font-semibold text">Sharing your bill means that;</p>
          <p className="text-skin-secondary ">
            <span className="text-skin-orange">&#x2022;</span> Your You can get{' '}
            <span>
              <img src={spotify} alt="" className="inline" />
            </span>{' '}
            premium for as low as{' '}
            <span className="text-skin-orange">shs.4000</span>.
          </p>
          <p className="text-skin-secondary">
            <span className="text-skin-orange">&#x2022;</span> You can get{'  '}
            <span>
              <img src={netflix} alt="" className="inline" />
            </span>{' '}
            premium for as low as{'  '}
            <span className="text-skin-orange">shs.11000</span> for all your
            devices.
          </p>
          <p className="text-skin-secondary">
            <span className="text-skin-orange">&#x2022;</span> And to top it up,{' '}
            <span className="text-skin-orange">no credit card needed</span>, pay
            using mobile money.
          </p>
        </div>
        <div className="text-xl space-y-2">
          <p className="font-semibold text">All you need to do is...</p>
          <p className="text-skin-secondary ">
            <span className="text-skin-orange font-semibold">1.</span> Create an
            Account
          </p>
          <p className="text-skin-secondary">
            <span className="text-skin-orange font-semibold">2.</span> Load some
            money onto your account via mobile money
          </p>
          <p className="text-skin-secondary">
            <span className="text-skin-orange font-semibold">3.</span> Find and
            join a household
          </p>
          <p className="text-skin-secondary">
            <span className="text-skin-orange font-semibold">4.</span> And just
            wait for the logins
          </p>
        </div>
        <Link to={'/signin' + window.location.search} className="text-center">
          <button className="primary ">Sign In</button>
        </Link>
      </div>
    </Layout>
  );
}
