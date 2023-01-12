import { Response } from 'supertest';
import * as request from 'supertest';
import { HttpStatus, INestApplication, Logger } from '@nestjs/common';

import { AuthResponse, AvailabilityResponse, BooleanReponse, CreateUserDto, LoginUserDto } from '@lib/type';

import { initializeTestApp, jwtRegExp, userDto, userDto1 } from './default.e2e';
import { User } from '../src/user/user.model';
import { GoogleAuthService } from '../src/auth/auth.google.client';
import { TestingModuleBuilder } from '@nestjs/testing';

describe('Auth controller group of tests', () => {
  let app: INestApplication;

  const registrationUrl = '/auth/signup';
  const logInUrl = '/auth/login';
  const createEmailCheckUrl = (email: string) => `/auth/email/${email}`;

  const logInGoogleUrl = '/auth/google';
  //just set of numbers and letters because google 0auth2 client mocked
  const tokenIdStub = '0d8iajs0jdap9spi';

  beforeAll(async () => {
    Logger.log('BeforeAll call');
    const overrideProvider = (builder: TestingModuleBuilder) => {
      return builder
        .overrideProvider(GoogleAuthService).useValue({
          getGooglePayload: () => ({ email: userDto.email, name: userDto.name })
        });
    }
    app = await initializeTestApp(overrideProvider);
  });

  afterAll(async () => {
    Logger.log('AfterAll call');
    await Promise.all([app.close()]);
  });

  afterEach(() => {
    User.truncate();
  });

  const logInWithGoogle = async (
    tokenId: string,
    status: HttpStatus,
    check: (response: Response) => void
  ) => {
    const response: request.Response = await request(app.getHttpServer())
      .post(logInGoogleUrl)
      .send({ tokenId })
      .expect(status);

    check(response);
    return response;
  }

  const logIn = async (
    dto: LoginUserDto,
    status: HttpStatus,
    check: (response: Response) => void
  ) => {
    const response: request.Response = await request(app.getHttpServer())
      .post(logInUrl)
      .send(dto)
      .expect(status);

    check(response);
    return response;
  }

  const checkEmail = async (
    email: string,
    status: HttpStatus,
    check: (response: Response) => void
  ): Promise<Response> => {
    const response: request.Response = await request(app.getHttpServer())
      .get(createEmailCheckUrl(email))
      .expect(status);

    check(response);
    return response;
  }

  const createUser = async (
    user: CreateUserDto,
    status: HttpStatus,
    check: (response: Response) => void
  ): Promise<Response> => {
    const response: request.Response = await request(app.getHttpServer())
      .post(registrationUrl)
      .send(user)
      .expect(status);

    check(response);
    return response;
  }

  const createUserAndAllFine = async (user: CreateUserDto) => {
    return createUser(user, HttpStatus.CREATED, checkThatTokenCorrect);
  }

  const checkThatTokenCorrect = (response: Response) => {
    const resBody: AuthResponse = response.body;
    const jwtToken = resBody.token
    expect(jwtToken).toMatch(jwtRegExp);
  }

  const checkThatTokenNotExist = (response: Response) => {
    const resBody: AuthResponse = response.body;
    const jwtToken = resBody.token
    expect(jwtToken).toBeUndefined();
  }

  const getAuthToken = (response: Response) => {
    const resBody: AuthResponse = response.body;
    return resBody.token;
  }

  const checkEmailAvailability = (response: Response, available: BooleanReponse) => {
    const result: AvailabilityResponse = response.body;
    expect(result.available).toBe(available);
  }

  it('default registration two users', async () => {
    const response = await createUserAndAllFine(userDto);
    const jwtToken = getAuthToken(response);

    const response2 = await createUserAndAllFine(userDto1);
    const jwtToken2 = getAuthToken(response2);

    expect(jwtToken !== jwtToken2).toBeTruthy();
  });

  it('try to create the same user', async () => {
    await createUserAndAllFine(userDto);
    await createUser(userDto, HttpStatus.BAD_REQUEST, checkThatTokenNotExist);
  });

  it('login', async () => {
    await logIn(userDto, HttpStatus.UNAUTHORIZED, checkThatTokenNotExist);
    await createUserAndAllFine(userDto);
    await logIn(userDto, HttpStatus.OK, checkThatTokenCorrect);
  });

  it('login with google', async () => {
    //first time works like registration
    await logInWithGoogle(tokenIdStub, HttpStatus.OK, checkThatTokenCorrect);
    //second like login
    await logInWithGoogle(tokenIdStub, HttpStatus.OK, checkThatTokenCorrect);
  });

  it('email check api', async () => {
    const email = userDto.email;
    await checkEmail(email, HttpStatus.OK, (res) => checkEmailAvailability(res, BooleanReponse.true));
    await createUserAndAllFine(userDto);
    await checkEmail(email, HttpStatus.OK, (res) => checkEmailAvailability(res, BooleanReponse.false));
  });
});
