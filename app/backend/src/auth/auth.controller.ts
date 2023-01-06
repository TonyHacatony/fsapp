import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Get,
} from '@nestjs/common';

import { AuthResponse, CreateUserDto, Role, LoginUserDto } from '@lib/type';

import { AuthService } from './auth.service';
import { Roles } from './auth.decorator';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Roles(Role.Guest)
  @Post('/login')
  login(@Body() dto: LoginUserDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Roles(Role.Guest)
  @Post('/signup')
  registration(@Body() dto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.registration(dto);
  }

  @Roles(Role.Guest)
  @Post('/google')
  async authWithGoogle(
    @Body() { tokenId },
  ): Promise<AuthResponse | UnauthorizedException> {
    return this.authService.loginWithGoogle(tokenId);
  }

  @Roles(Role.Admin)
  @Get('/hide')
  async getSecuredData() {
    return { msg: 'Secure data' };
  }
}
