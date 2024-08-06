import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    res.redirect('/');
  }
}
