import { Logger, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import * as bcrypt from 'bcrypt';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { User } from './user/user.model';
import { Role } from '@lib/type';

const PORT_KEY = 'BACKEND_PORT';

async function bootstrap() {
  const port = process.env[PORT_KEY];
  if (!port) {
    Logger.log(`Please add "${PORT_KEY}" as environmental variable to start`);
    return;
  }

  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'https://fsapp-front.vercel.app',
      'https://fsapp-front.vercel.app/*',
      'http://localhost:3000',
      'http://localhost',
    ],
  });
  addHooks();
  setUpGlobalGuards(app);

  await app.listen(port, () => Logger.log(`Run on port: ${port}`));
}

function setUpGlobalGuards(app: INestApplication) {
  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(jwtService, reflector));
}

function addHooks() {
  User.beforeCreate(async (user) => {
    if (user.isNewRecord) {
      const roles = user.getDataValue('roles');
      if (roles === undefined || roles.length === 0) {
        user.setDataValue('roles', [Role.User]);
      }

      const pass = user.getDataValue('password');
      if (Boolean(pass)) {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(pass, salt);
        user.setDataValue('password', hash);
      }
    }
  });
}

bootstrap();
