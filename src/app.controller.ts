import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { get } from 'http';
import { stat } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello(@Req() req: Request): object {
    const isAuthenticated = req.cookies.token ? true : false;
    return { isAuthenticated: isAuthenticated };
  }

  @Get('login')
  getLogin(@Req() req: Request, @Res() res): void {
    if (req.cookies && req.cookies.token) {
      // Change the url to the home page
      res.redirect('/');
    } else {
      res.render('login', {
        status: 'success',
        message: 'You are not logged in',
      });
    }
  }

  @Get('register')
  @Render('register')
  getRegister(): object {
    return { title: 'NestJS App', subtitle: 'Register for the NestJS App' };
  }
}
