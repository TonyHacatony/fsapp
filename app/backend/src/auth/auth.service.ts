import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginTicket,
  OAuth2Client,
  TokenPayload as GooglePayload,
} from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthResponse, TokenPayload, CreateUserDto } from '@lib/type';

import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { BadRequestException } from '@nestjs/common/exceptions';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage',
);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async loginWithGoogle(
    tokenId: string,
  ): Promise<AuthResponse | UnauthorizedException> {
    const ticket: LoginTicket = await googleClient.verifyIdToken({
      idToken: tokenId,
    });
    if (!ticket) {
      throw new UnauthorizedException('Invalid - google id token');
    }

    const payload: GooglePayload = ticket.getPayload();
    const email: string = payload.email;
    let user: User = await this.userService.getUserByEmail(email);
    if (user) {
      return { ...this.generateToken(user) };
    }

    const userDto: CreateUserDto = {
      email,
      name: payload.name,
      password: 'asdasdasd',
    };
    user = await this.userService.createUser(userDto);
    return { ...this.generateToken(user) };
  }

  async login(dto: CreateUserDto): Promise<AuthResponse> {
    const user = await this.validateUser(dto);
    return { ...this.generateToken(user) };
  }

  async registration(dto: CreateUserDto) {
    const existedUser = await this.userService.getUserByEmail(dto.email);
    if (existedUser) {
      throw new BadRequestException('User exists');
    }
    const salt = 10;
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const user = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });
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
    const user = await this.userService.getUserByEmail(dto.email);
    const passwordEquals = await bcrypt.compare(dto.password, user['password']);
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Incorrect email or password' });
  }
}
