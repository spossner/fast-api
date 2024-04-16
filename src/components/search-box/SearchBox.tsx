'use client';

import * as _ from 'lodash';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';

type SearchResult = {
  result: string[];
  meta: {
    total: number;
    duration: number;
  };
};

const SearchBox = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState<SearchResult | undefined>();

  const debouncedSearch = useCallback(
    _.debounce(async (text: string) => {
      console.log(`searching ${text}`);

      // const response = await fetch(`/api/search?q=${text}`);
      // const data = await response.json();
      // setResults(data);
    }, 200),
    []
  );

  useEffect(() => {
    debouncedSearch(text);
  }, [text]);

  return (
    <div>
      <input
        type="search"
        placeholder="Country..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border rounded-lg px-3 py-2"
      />
      <div>{results?.result}</div>
    </div>
  );
};
export default SearchBox;
