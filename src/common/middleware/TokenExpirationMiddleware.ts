import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class TokenExpirationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (token) {
      try {
        verify(token, process.env.JWT_SECRET);
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
