import SearchBox from '@/components/search-box/SearchBox';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Hello world</h1>
      <SearchBox />
    </>
  );
}
