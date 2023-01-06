import { Role } from './role.enum';
import { LoginUserDto } from './login.user.dto';

export type AdditionalUserInfoDto = {
  readonly name?: string;
  readonly roles?: Role[];
}

export type CreateUserDto = AdditionalUserInfoDto & LoginUserDto;
