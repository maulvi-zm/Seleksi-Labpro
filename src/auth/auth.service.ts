import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bycrypt from 'bcrypt';
import { AuthEntity } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(createAuthDto: LoginDto) {
    const { username, password } = createAuthDto;

    // Find user by email
    let user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      // Find by email
      user = await this.prismaService.user.findUnique({
        where: { email: username },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    const isPasswordValid = await bycrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return new AuthEntity(
      user.username,
      this.jwtService.sign({ user_id: user.user_id }),
    );
  }
}
