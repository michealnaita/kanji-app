import React, { Children } from 'react';
import ContentLoader from 'react-content-loader';

const Loader: React.FC<{ children: JSX.Element[]; [key: string]: any }> = ({
  children,
  ...props
}) => {
  return (
    <ContentLoader
      backgroundColor="#ffffff"
      foregroundColor="#ffffff"
      foregroundOpacity={0.04}
      backgroundOpacity={0.02}
      {...props}
    >
      {children}
    </ContentLoader>
  );
};
export default Loader;
