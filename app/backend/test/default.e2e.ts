import { CreateUserDto, Role } from "@lib/type";
import { INestApplication, LoggerService } from "@nestjs/common";
import { Test, TestingModule, TestingModuleBuilder } from "@nestjs/testing";

import { AppModule } from "../src/app.module";
import { GoogleAuthService } from "../src/auth/auth.google.client";

export class StubLogger implements LoggerService {
  log(message: string) { }
  error(message: string, trace: string) { }
  warn(message: string) { }
  debug(message: string) { }
  verbose(message: string) { }
}

export type AdditionalOverride = (builder: TestingModuleBuilder) => TestingModuleBuilder;

export async function initializeTestApp(overrideProviders?: AdditionalOverride): Promise<INestApplication> {
  let moduleFixture: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
    providers: [GoogleAuthService],
  })

  if (overrideProviders) {
    moduleFixture = overrideProviders(moduleFixture);
  }

  const buildedApp: TestingModule = await moduleFixture.compile();
  const app: INestApplication = buildedApp.createNestApplication();
  app.useLogger(new StubLogger());
  await app.init();
  return app;
}

export const userDto: CreateUserDto = {
  email: 'test@gmail.com',
  password: '.?</P[asdF8sdmsddfg',
  name: 'tester',
  roles: [Role.User],
};

export const userDto1: CreateUserDto = {
  email: 'test2@gmail.com',
  password: '.?</P[asdF8sdmsddfg',
  name: 'tester2',
  roles: [Role.User],
};

export const jwtRegExp = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
