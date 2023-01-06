import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Role } from '@lib/type';
import { InternalServerErrorException } from '@nestjs/common/exceptions';

import { ROLES_KEY } from './auth.decorator';
import { User } from '../user/user.model';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const endpointRoles: string[] | undefined = this.reflector.get(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!endpointRoles) {
      throw new InternalServerErrorException(
        'Unavailable endpoint because rolles was skipped',
      );
    }

    if (this.shouldSkipAuthCheck(endpointRoles)) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user: User = this.verifyToken(req);
    req.user = user;
    console.log(user);
    const available = user.roles.some((role: Role) =>
      endpointRoles.includes(role),
    );
    if (!available) {
      throw new UnauthorizedException(
        "Invalid You don't have enough permissions",
      );
    }
    return available;
  }

  private shouldSkipAuthCheck(endpointRoles: string[]): boolean {
    return endpointRoles.includes(Role.Guest);
  }

  private verifyToken(req: { headers: { authorization: string } }): User {
    const authHeader: string = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Incorrect authorization header');
    }
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.jwtService.verify<User>(token);
  }
}
