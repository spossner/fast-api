'use client';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { CommandGroup } from 'cmdk';
import * as _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

type SearchResult = {
  result: string[];
  meta: {
    total: number;
    duration: number;
  };
};

export default function Home() {
  const [searchResult, setSearchResult] = useState<SearchResult | undefined>();
  const [text, setText] = useState('');

  const debouncedSearch = useCallback(
    _.debounce(async (text: string) => {
      if (_.isEmpty(text)) {
        setSearchResult(undefined);
        return;
      }

      // const response = await fetch(`/api/search?q=${text}`);
      const response = await fetch(
        `https://fastapi.possner.workers.dev/api/search?q=${text}`
      );
      if (response.status === 200) {
        const data = await response.json();
        setSearchResult(data);
      }
    }, 200),
    [setSearchResult]
  );

  useEffect(() => {
    debouncedSearch(text);
  }, [text]);

  return (
    <>
      <div className="flex flex-col gap-4 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5 items-center pt-32">
        <h1 className="text-5xl font-bold tracking-tight">Speed search</h1>
        <div className="text-center text-zinc-600">
          A high-performance API built with Next.js, Hono, Redis and Cloudflare.
          <br />
          Type a query below and get your results in milliseconds.
        </div>
        <div className="max-w-md w-full mx-auto">
          <Command>
            <CommandInput
              placeholder="Search for a country..."
              value={text}
              onValueChange={setText}
              className="placeholder:text-zinc-500"
            />
            <CommandList>
              {searchResult && (
                <>
                  <CommandGroup
                    heading={`Results (${searchResult.meta.total})`}
                  >
                    {searchResult.result.map((country) => (
                      <CommandItem
                        key={country}
                        value={country}
                        onSelect={setText}
                      >
                        {country}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <div className="h-px w-full bg-zinc-200" />
                  <p className="p-2 text-xs text-zinc-500">
                    Found {searchResult.meta.total} results in{' '}
                    {searchResult.meta.duration.toFixed(0)}ms
                  </p>
                </>
              )}
            </CommandList>
          </Command>
        </div>

        <ul className="flex flex-col gap-1 pl-4"></ul>
      </div>
    </>
  );
}
