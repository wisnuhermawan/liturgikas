import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import bibleRoutes from './routes/bible';
import authRoutes from './routes/auth';
import contentsRoutes from './routes/contents';
import categoriesRoutes from './routes/categories';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', secureHeaders());
app.use(
  '*',
  cors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3001,http://localhost:3002').split(','),
    credentials: true,
  })
);
app.use('*', prettyJSON());

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Info
app.get('/', (c) => {
  return c.json({
    name: 'Catholic Platform API',
    version: '1.0.0',
    description: 'RESTful API for Catholic Information Platform',
    documentation: '/api/docs',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      bible: '/api/bible',
      catechism: '/api/catechism',
      saints: '/api/saints',
      liturgy: '/api/liturgy',
      contents: '/api/contents',
      search: '/api/search',
    },
  });
});

// Mount API routes
app.route('/api/auth', authRoutes);
app.route('/api/bible', bibleRoutes);
app.route('/api/contents', contentsRoutes);
app.route('/api/categories', categoriesRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json(
    {
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    },
    500
  );
});

const port = Number(process.env.API_PORT) || 3000;

console.log(`🚀 Catholic Platform API starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`✅ API running at http://localhost:${port}`);
console.log(`📚 Documentation: http://localhost:${port}/api/docs`);

export default app;
