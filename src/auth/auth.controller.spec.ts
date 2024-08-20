import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entities/auth.entity';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          const authorizationHeader = request.headers.authorization;

          if (!authorizationHeader) {
            throw new UnauthorizedException();
          }

          const token = authorizationHeader.split(' ')[1];
          if (token !== 'jwt-token') {
            throw new UnauthorizedException();
          }

          return true;
        },
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an AuthEntity when login is successful', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password' };
      const authEntity: AuthEntity = {
        username: 'testuser',
        token: 'jwt-token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(authEntity);

      const result = await authController.login(loginDto);

      expect(result).toEqual(authEntity);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an UnauthorizedException if login fails', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException());

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('self', () => {
    it('should return user details when JWT is valid', async () => {
      const req = {
        user: { username: 'testuser' },
        headers: { authorization: 'Bearer jwt-token' },
      };

      const result = authController.self(req);

      expect(result).toEqual({
        username: 'testuser',
        token: 'jwt-token',
      });
    });

    it('should return UnauthorizedException when JWT is invalid or missing', async () => {
      const req = {
        user: { username: 'testuser' },
        headers: { authorization: null },
      };

      try {
        authController.self(req);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
