import * as debug from 'debug'; // Importar 'debug' como un módulo en lugar de como una función

const log = debug('posts-API:main');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, () =>
    log(`Server running on http://localhost:${port}`),
  );
}
bootstrap();
