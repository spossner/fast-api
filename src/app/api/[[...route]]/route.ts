import { Redis } from '@upstash/redis/cloudflare';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';
import * as _ from 'lodash';

export const runtime = 'edge';

const app = new Hono().basePath('/api');
app.use('/*', cors());

type FastApiEnvConfig = {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
};

app.get('/search', async (c) => {
  try {
    const timerStart = performance.now();
    const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
      env<FastApiEnvConfig>(c);
    const searchText = c.req.query('q')?.toUpperCase();
    if (!searchText) {
      return c.text('Missing search text', 400);
    }
    const redis = new Redis({
      token: UPSTASH_REDIS_REST_TOKEN,
      url: UPSTASH_REDIS_REST_URL,
    });

    const rank = await redis.zrank('terms', searchText);
    let result: string[] = [];

    if (!_.isNil(rank)) {
      result = (await redis.zrange<string[]>('terms', rank, rank + 100))
        .filter(
          (e) => e.charAt(e.length - 1) === '*' && e.startsWith(searchText)
        )
        .map((e) => e.slice(0, -1));
    }

    const duration = performance.now() - timerStart;
    return c.json({
      result,
      meta: {
        total: result.length,
        duration,
      },
    });
  } catch (err) {
    console.error(err);
    return c.text('Something went wrong', 500);
  }
});

export const GET = handle(app);
export default app as never;
