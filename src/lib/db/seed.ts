import { Redis, ScoreMember } from '@upstash/redis';
import 'dotenv/config';

import { countryList } from './data';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
});

countryList.forEach(async (country) => {
  //   const data = await redis.set('foo', 'bar');
  const term = country.toUpperCase();
  const terms: ScoreMember<string>[] = [];
  for (let i = 1; i < term.length; i++) {
    terms.push({ score: 0, member: term.substring(0, i) });
  }
  terms.push({ score: 0, member: term + '*' });
  const [first, ...rest] = terms;
  await redis.zadd('terms', first, ...rest);
});
