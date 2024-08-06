import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello(@Req() req): object {
    const isAuthenticated = req.cookies.token ? true : false;

    return { isAuthenticated: isAuthenticated };
  }

  @Get('login')
  @Render('login')
  getLogin(): object {
    return { title: 'NestJS App', subtitle: 'Login to the NestJS App' };
  }
}
