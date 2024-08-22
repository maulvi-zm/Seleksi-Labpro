import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private jwtStrategy: JwtStrategy) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['token'];

    if (token) {
      try {
        req.headers.authorization = `Bearer ${token}`;
        const decoded = jwt.decode(token) as { user_id: string };
        const user = await this.jwtStrategy.validate(decoded);
        req.user = user;
      } catch (error) {
        req.user = null;
      }
    }
    next();
  }
}
