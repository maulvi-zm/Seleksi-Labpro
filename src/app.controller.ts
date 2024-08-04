import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello(): object {
    return { title: 'NestJS App', subtitle: 'Welcome to the NestJS App' };
  }
}
