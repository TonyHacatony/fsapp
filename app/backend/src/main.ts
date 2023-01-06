import { Logger, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

const PORT_KEY = 'BACKEND_PORT';

async function bootstrap() {
  const port = process.env[PORT_KEY];
  if (!port) {
    Logger.log(`Please add "${PORT_KEY}" as environmental variable to start`);
    return;
  }

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  setUpGlobalGuards(app);

  await app.listen(port, () => Logger.log(`Run on port: ${port}`));
}

function setUpGlobalGuards(app: INestApplication) {
  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(jwtService, reflector));
}

bootstrap();
