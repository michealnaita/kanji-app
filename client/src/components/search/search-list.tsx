import React from 'react';
import { Household } from '../../utils/types';
import SearchCard from './search-card';

export default function SearchList({ items }: { items: Household[] }) {
  return (
    <ul className="space-y-4 h-full overflow-y-scroll py-7">
      {items.map((household, i) => (
        <li key={i}>
          <SearchCard data={household} />
        </li>
      ))}
    </ul>
  );
}
