import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT_KEY = 'BACKEND_PORT';

async function bootstrap() {
  const port = process.env[PORT_KEY];
  if (!port) {
    Logger.log(`Please add "${PORT_KEY}" as environmental variable to start`);
    return;
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(port, () => Logger.log(`Run on port: ${port}`));
}

bootstrap();
