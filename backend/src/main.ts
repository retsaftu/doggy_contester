import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { port } from 'config/config.json';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
