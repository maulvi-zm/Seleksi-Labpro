import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@ApiTags('users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('api/users')
  @ApiOperation({ summary: 'Create a user' })
  @ApiConsumes('application/json')
  @ApiBody({
    required: true,
    type: CreateUserDto,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('api/users')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('api/users/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('api/users/:id/balance')
  @ApiOperation({ summary: 'Update a user balance by ID' })
  @ApiConsumes('application/json')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        increment: {
          type: 'number',
          example: 100,
        },
      },
    },
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  increaseBalance(
    @Param('id') id: string,
    @Body() { increment }: { increment: number },
  ) {
    return this.usersService.increaseBalance(id, increment);
  }

  @Put('api/users/:id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiConsumes('application/json')
  @ApiBody({
    required: true,
    type: UpdateUserDto,
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('api/users/:id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
