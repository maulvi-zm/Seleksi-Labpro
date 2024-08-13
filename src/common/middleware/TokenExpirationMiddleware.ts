import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify, TokenExpiredError } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenExpirationMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (token) {
      try {
        verify(token, this.configService.get<string>('JWT_SECRET'));
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          res.clearCookie('token');
          return res.render('login', {
            status: 'error',
            message: 'Token expired',
          });
        }
      }
    }

    next();
  }
}
