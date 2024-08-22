import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('api/login')
  @ApiOperation({ summary: 'Login' })
  @ApiConsumes('application/json')
  @ApiBody({
    required: true,
    type: LoginDto,
  })
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() createAuthDto: LoginDto) {
    return this.authService.login(createAuthDto);
  }

  @Get('api/self')
  @ApiOperation({ summary: 'Get self' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  self(@Request() req) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }
    return {
      username: req.user.username,
      token: req.headers.authorization.split(' ')[1],
    };
  }
}
