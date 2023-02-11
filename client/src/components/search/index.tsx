import React from 'react';
import useSearch from '../../api/useSearch';
import ErrorMessage from '../shared/error-message';
import SearchList from './search-list';
import SearchLoader from './search-loader';

export default function Search() {
  const { data, isLoading, isError, error } = useSearch();
  return (
    <div className="space-y- flex flex-col h-full ">
      <div className="font-semibold text-white">
        <h1 className="opacity-50 text-xl">Browse For Your Household</h1>
        <h2 className=" opacity-30 text-base">
          {data ? data.length : 0} households
        </h2>
      </div>
      {isLoading ? (
        <SearchLoader />
      ) : isError ? (
        <ErrorMessage message={(error as Error).message} />
      ) : (
        <div className="flex-1 scroll-view h-full overflow-hidden  ">
          {data && <SearchList items={data} />}
        </div>
      )}
    </div>
  );
}
