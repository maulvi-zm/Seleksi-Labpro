import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['token'];
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          this.configService.get<string>('JWT_SECRET'),
        ) as { user_id: string };
        const user = await this.usersService.findOne(decoded.user_id);
        if (user) {
          req.user = user;
        }
      } catch (error) {
        req.user = null;
      }
    }
    next();
  }
}
