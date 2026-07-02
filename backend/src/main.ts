import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow images to load on frontend
  }));

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Serve uploaded files statically
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 BMM CMS Backend running on http://localhost:${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`📁 Uploads served at: http://localhost:${port}/uploads/`);
}
bootstrap();
