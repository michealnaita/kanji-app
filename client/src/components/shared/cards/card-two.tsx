import React from 'react';
import { TfiAngleLeft } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';
type CardProps = {
  title: string;
  children: any;
  button?: JSX.Element;
};

export default function CardTwo({ title, children, button }: CardProps) {
  const navigate = useNavigate();
  return (
    <div className="card flex flex-col space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex space-x-4 items-center"
      >
        <TfiAngleLeft color="#828282" size={25} />{' '}
        <p className="font-patrick-hand text-skin-secondary font-semibold text-3xl">
          {title}
        </p>
      </button>
      <>
        {children}
        {button && button}
      </>
    </div>
  );
}
