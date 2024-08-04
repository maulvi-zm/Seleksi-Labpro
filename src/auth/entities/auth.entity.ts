import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AuthEntity {
  constructor(username: string, token: string) {
    this.username = username;
    this.token = token;
  }

  @ApiProperty()
  username: string;

  @ApiProperty()
  token: string;
}
