// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts', // Configures the seed command for v7 [[36], [115]]
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});