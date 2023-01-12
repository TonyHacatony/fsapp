import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { GoogleAuthService } from './auth.google.client';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleAuthService],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'HIDDEN',
      signOptions: {
        expiresIn: '12h',
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
