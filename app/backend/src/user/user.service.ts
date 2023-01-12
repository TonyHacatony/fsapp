import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common/services';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '@lib/type';

import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    const user = {
      ...dto,
      password: this.hashPassword(dto.password),
    };
    Logger.log(user);
    return await this.userRepository.create(user);
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  private hashPassword(pass: string): string {
    if (!Boolean(pass)) {
      return '';
    }
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(pass, salt);
  }
}
