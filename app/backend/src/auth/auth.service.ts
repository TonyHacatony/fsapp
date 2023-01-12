import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';

import { AuthResponse, TokenPayload, CreateUserDto } from '@lib/type';

import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { GoogleAuthService } from './auth.google.client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private googleAuthServide: GoogleAuthService,
  ) {}

  async loginWithGoogle(
    tokenId: string,
  ): Promise<AuthResponse | UnauthorizedException> {
    const { email, name } = await this.googleAuthServide.getGooglePayload(
      tokenId,
    );
    let user: User = await this.userService.getUserByEmail(email);
    if (user) {
      return { ...this.generateToken(user) };
    }

    const userDto: CreateUserDto = {
      email,
      name: name,
      password: 'asdasdasd',
    };
    user = await this.userService.createUser(userDto);
    return { ...this.generateToken(user) };
  }

  async login(dto: CreateUserDto): Promise<AuthResponse> {
    const user: User = await this.validateUser(dto);
    return { ...this.generateToken(user) };
  }

  async registration(dto: CreateUserDto) {
    const existedUser = await this.userService.getUserByEmail(dto.email);
    if (existedUser) {
      throw new BadRequestException('User exists');
    }
    const user = await this.userService.createUser(dto);
    return this.generateToken(user);
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    return !Boolean(await this.userService.getUserByEmail(email));
  }

  private generateToken(user: User): AuthResponse {
    const { id, name, email, roles } = user;
    const payload: TokenPayload = { id, name, email, roles };
    return { token: this.jwtService.sign(payload) };
  }

  private async validateUser(dto: CreateUserDto) {
    const user: User = await this.userService.getUserByEmail(dto.email);
    if (user) {
      const passwordEquals = await bcrypt.compare(dto.password, user.password);
      if (user && passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({ message: 'Incorrect email or password' });
  }
}
