import React from 'react';
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="text-skin-red">
      <p className="text-skin-red text-lg">{message}</p>
    </div>
  );
};
export default ErrorMessage;
