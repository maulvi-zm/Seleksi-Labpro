import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { TokenExpiredError } from 'jsonwebtoken';
import { threadId } from 'worker_threads';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('api/login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() createAuthDto: LoginDto) {
    return this.authService.login(createAuthDto);
  }

  @Get('api/self')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  self(@Request() req) {
    return {
      username: req.user.username,
      token: req.headers.authorization.split(' ')[1],
    };
  }

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async loginWeb(@Body() createAuthDto: LoginDto, @Res() res) {
    try {
      const user = await this.authService.login(createAuthDto);

      if (user) {
        res.cookie('token', user.token, { httpOnly: true });
        res.redirect('/');
      }
    } catch (error) {
      res.render('login', { message: error.message, status: 'error' });
    }
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res) {
    res.clearCookie('token');
    res.redirect('/login');
  }

  @Post('register')
  @FormDataRequest({ storage: MemoryStoredFile })
  async register(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      const user = await this.userService.create(createUserDto);

      if (user) {
        res.redirect('/login');
      }
    } catch (error) {
      res.render('register', { message: error.message, status: 'error' });
    }
  }
}
