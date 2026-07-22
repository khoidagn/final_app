import { defineConfig } from 'prisma/config';
import { config } from './src/config/env.js';
console.log('DATABASE_URL =', config.database.url);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: config?.database?.url,
  },
});
