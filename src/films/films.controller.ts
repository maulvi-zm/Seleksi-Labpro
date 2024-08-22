import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  Req,
} from '@nestjs/common';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorator/roles.decorator';

@ApiTags('films')
@Controller()
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post('api/films')
  @ApiOperation({ summary: 'Create a film' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    type: CreateFilmDto,
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @FormDataRequest({ storage: MemoryStoredFile })
  create(@Body() createFilmDto: CreateFilmDto) {
    return this.filmsService.create(createFilmDto);
  }

  @ApiOperation({ summary: 'Get all films' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Query string for searching films by title or director',
  })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get('api/films')
  findAll(@Query('q') q: string) {
    return this.filmsService.findAll(q);
  }

  @ApiOperation({ summary: 'Get a film by ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('api/films/:id')
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }

  @Put('api/films/:id')
  @ApiOperation({ summary: 'Update a film' })
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: MemoryStoredFile })
  @ApiBody({
    required: true,
    type: UpdateFilmDto,
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateFilmDto: UpdateFilmDto) {
    return this.filmsService.update(id, updateFilmDto);
  }

  @ApiOperation({ summary: 'Delete a film' })
  @Delete('api/films/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.filmsService.remove(id);
  }

  @Post('films/:id/buy')
  @ApiOperation({ summary: 'Buy a film' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  buyFilm(@Param('id') id: string, @Req() req: any): object {
    if (req.headers.referer.split('/').pop() !== id) {
      throw new Error('Invalid request');
    }

    return this.filmsService.buyFilm(id, req.user.id);
  }

  @Post('films/:id/wishlist')
  @ApiOperation({ summary: 'Add a film to wishlist' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  addWishlist(@Param('id') id: string, @Req() req: any): object {
    if (req.headers.referer.split('/').pop() !== id) {
      throw new Error('Invalid request');
    }

    return this.filmsService.addWishlist(id, req.user.id);
  }
}
