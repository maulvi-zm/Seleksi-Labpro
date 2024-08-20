import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { first, last } from 'rxjs';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return AuthEntity when login is successful with username', async () => {
    const user = {
      user_id: 'user-id',
      username: 'testuser',
      password: 'hashed-password',
      email: 'testuser@example.com',
      balance: 0,
      first_name: 'Test',
      last_name: 'User',
      role: Role.USER,
    };
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwtService, 'sign').mockReturnValue('jwt-token');

    const loginDto: LoginDto = { username: 'testuser', password: 'password' };
    const result = await authService.login(loginDto);

    expect(result).toEqual({
      username: user.username,
      token: 'jwt-token',
    });
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { username: loginDto.username },
    });
  });

  it('should return AuthEntity when login is successful with email', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValueOnce(null) // username not found
      .mockResolvedValueOnce({
        user_id: 'user-id',
        username: 'testuser',
        password: 'hashed-password',
        email: 'testuser@example.com',
        balance: 0,
        first_name: 'Test',
        last_name: 'User',
        role: Role.USER,
      }); // email found
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwtService, 'sign').mockReturnValue('jwt-token');

    const loginDto: LoginDto = {
      username: 'testuser@test.com',
      password: 'password',
    };
    const result = await authService.login(loginDto);

    expect(result).toEqual({
      username: 'testuser',
      token: 'jwt-token',
    });
    expect(prismaService.user.findUnique).toHaveBeenCalledTimes(2);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: loginDto.username },
    });
  });

  it('should throw NotFoundException if user is not found', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

    const loginDto: LoginDto = {
      username: 'nonexistent',
      password: 'password',
    };

    await expect(authService.login(loginDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const user = {
      user_id: 'user-id',
      username: 'testuser',
      password: 'hashed-password',
      email: 'testuser@example.com',
      balance: 0,
      first_name: 'Test',
      last_name: 'User',
      role: Role.USER,
    };
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const loginDto: LoginDto = {
      username: 'testuser',
      password: 'wrong-password',
    };

    await expect(authService.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
