import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    if (
      await this.prismaService.user.findUnique({
        where: { username: createUserDto.username },
      })
    ) {
      throw new Error('Username already exists');
    }
    if (
      await this.prismaService.user.findUnique({
        where: { email: createUserDto.email },
      })
    ) {
      throw new Error('Email already exists');
    }

    if (createUserDto.password !== createUserDto.password_confirmation) {
      throw new Error('Passwords do not match');
    }

    const salt = bcrypt.genSaltSync(10);
    createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);

    const { password_confirmation, ...user } = createUserDto;

    return new UserResponseDto(
      await this.prismaService.user.create({
        data: {
          ...user,
        },
      }),
    );
  }

  async findAll() {
    const users = await this.prismaService.user.findMany({
      where: { role: Role.USER },
    });

    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(id: string) {
    return new UserResponseDto(
      await this.prismaService.user.findUnique({
        where: { user_id: id },
      }),
    );
  }

  async increaseBalance(id: string, increment: number) {
    return new UserResponseDto(
      await this.prismaService.user.update({
        where: { user_id: id },
        data: {
          balance: {
            increment,
          },
        },
      }),
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const salt = bcrypt.genSaltSync(10);
    updateUserDto.password = bcrypt.hashSync(updateUserDto.password, salt);

    return new UserResponseDto(
      await this.prismaService.user.update({
        where: { user_id: id },
        data: updateUserDto,
      }),
    );
  }

  remove(id: string) {
    return this.prismaService.user.delete({
      where: { user_id: id },
    });
  }
}
