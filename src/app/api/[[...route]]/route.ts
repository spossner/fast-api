import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.get('/search', (c) => {
  return c.json({
    result: [],
    meta: {
      total: 0,
      duration: 0,
    },
  });
});

export const GET = handle(app);
export default app as never;
