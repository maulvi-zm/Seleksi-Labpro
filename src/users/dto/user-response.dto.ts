import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  @Exclude()
  role: Role;

  // TODO exclude from response

  constructor(user: User) {
    this.id = user.user_id;
    this.username = user.username;
    this.email = user.email;
    this.balance = user.balance;
    this.role = user.role;
  }
}
