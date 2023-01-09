import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, Role } from '@lib/type';

import { User } from './user.model';
import { Logger } from '@nestjs/common/services';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  async findUser(id: number) {
    const user: User = await this.findUserById(id);
    const { email, createdAt, images, name } = user;
    return { name, email, images, createdAt };
  }

  async createUser(dto: CreateUserDto) {
    const user = {
      // roles: [Role.User],
      ...dto,
      password: this.hashPassword(dto.password),
    };
    Logger.log(user);
    return await this.userRepository.create(user);
  }

  async editUser(id: number, dto: CreateUserDto) {
    const user: User = await this.findUserById(id);
    user.setDataValue('name', dto.name);
    await user.save();
    return user;
  }

  async findUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async validateUser(token: string): Promise<User> {
    const tokenObj = this.jwtService.decode(token.split(' ')[1]);
    return await this.getUserByEmail(tokenObj['email']);
  }

  private hashPassword(pass: string): string {
    if (!Boolean(pass)) {
      return '';
    }
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(pass, salt);
  }
}
