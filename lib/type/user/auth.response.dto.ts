import { Role } from './role.enum';

export type AuthResponse = {
  token: string;
}

export type AuthToken = TokenDefaultKeys & TokenPayload;

export type TokenPayload = {
  readonly id: number;
  readonly name?: string;
  readonly email?: string;
  readonly roles: Role[];
}

export type TokenDefaultKeys = {
  readonly exp: number;
  readonly iat: number;
}

