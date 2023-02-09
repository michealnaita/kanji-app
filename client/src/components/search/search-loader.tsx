import React from 'react';
import ContentLoader from '../shared/content-loader';

export default function SearchLoader() {
  return (
    <ContentLoader width={300} height={332}>
      <rect x="0" y="0" rx="16" ry="16" width="300" height="100" />
      <rect x="0" y="116" rx="16" ry="16" width="300" height="100" />
      <rect x="0" y="232" rx="16" ry="16" width="300" height="100" />
    </ContentLoader>
  );
}
