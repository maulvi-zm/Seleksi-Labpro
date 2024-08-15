import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';

@ApiTags('films')
@Controller()
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post('api/films')
  @ApiOperation({ summary: 'Create a film' })
  @ApiResponse({ status: 201, description: 'Film created successfully' })
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
  @ApiResponse({ status: 200, description: 'Return all films' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Query string for searching films by title or director',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('api/films')
  findAll(@Query('q') q: string) {
    return this.filmsService.findAll(q);
  }

  @ApiOperation({ summary: 'Get a film by ID' })
  @ApiResponse({ status: 200, description: 'Return the film' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('api/films/:id')
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }

  @Put('api/films/:id')
  @ApiOperation({ summary: 'Update a film' })
  @ApiResponse({ status: 201, description: 'Film created successfully' })
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
  @ApiResponse({ status: 200, description: 'Film deleted successfully' })
  @Delete('api/films/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.filmsService.remove(id);
  }

  @Post('films/:id/buy')
  @ApiOperation({ summary: 'Buy a film' })
  @ApiResponse({ status: 201, description: 'Film bought successfully' })
  @UseGuards(JwtAuthGuard)
  buyFilm(@Param('id') id: string, @Req() req: any): object {
    if (req.headers.referer.split('/').pop() !== id) {
      throw new Error('Invalid request');
    }

    return this.filmsService.buyFilm(id, req.user.id);
  }

  @Post('films/:id/wishlist')
  @ApiOperation({ summary: 'Add a film to wishlist' })
  @ApiResponse({
    status: 201,
    description: 'Film added to wishlist successfully',
  })
  @UseGuards(JwtAuthGuard)
  addWishlist(@Param('id') id: string, @Req() req: any): object {
    if (req.headers.referer.split('/').pop() !== id) {
      throw new Error('Invalid request');
    }

    return this.filmsService.addWishlist(id, req.user.id);
  }
}
