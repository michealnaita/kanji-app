import React from 'react';
type CardProps = {
  heading: string;
  button: string | JSX.Element;
  onClick: () => void;
  children: JSX.Element;
};
export default function Card({
  heading,
  button,
  onClick,
  children,
}: CardProps) {
  return (
    <div className=" flex flex-col shadow-lg bg-skin-secondary rounded-2xl p-7 space-y-4">
      <h1 className="text-2xl text-skin-off-white font-semibold">{heading}</h1>
      <div>{children}</div>
      <button
        onClick={onClick}
        className="font-semibold text-skin-lime self-center"
      >
        {button}
      </button>
    </div>
  );
}
