import {
  Controller,
  Get,
  Param,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { FilmsService } from './films/films.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly filmsService: FilmsService,
  ) {}

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
        data: {},
      });
    }
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res) {
    res.clearCookie('token');
    res.redirect('/login');
  }

  @Get('register')
  @Render('register')
  getRegister(): object {
    return {
      scripts: ['register.js'],
    };
  }

  @Get(['films', 'my-films', 'wishlist'])
  @UseGuards(JwtAuthGuard)
  @Render('films')
  async getFilms(
    @Req() req: any,
    @Query('q') q: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 9,
  ): Promise<object> {
    q = q || '';
    page = page || 1;
    limit = limit || 9;

    const isMyFilms = req.path.includes('my-films');
    const isWishlist = req.path.includes('wishlist');
    const userId = isMyFilms || isWishlist ? req.user.id : undefined;

    const filmsData = await this.filmsService.findAllwithPagination(
      q,
      page,
      limit,
      userId,
      isWishlist,
    );

    const recommendations = await this.filmsService.getRecommendedFilms(
      req.user.id,
    );

    return {
      recommendations: recommendations,
      ...filmsData,
    };
  }

  @Get('films/:id')
  @UseGuards(JwtAuthGuard)
  @Render('film-details')
  async getFilm(@Param('id') id: string, @Req() req): Promise<object> {
    const film = await this.filmsService.findOne(id);
    const reviews = await this.filmsService.getReviewswithPagination(id);
    const isPurchased = await this.filmsService.isPurchased(id, req.user.id);
    const isWishlisted = await this.filmsService.isWishlisted(id, req.user.id);

    const formattedReviews = reviews.map((review) => {
      return {
        ...review,
        created_at: review.created_at.toISOString(),
      };
    });

    const data = {
      ...film,
      reviews: formattedReviews,
      isPurchased,
      isWishlisted,
      scripts: ['film-details.js'],
    };

    return data;
  }

  @Get('films/:id/watch')
  @UseGuards(JwtAuthGuard)
  @Render('watch-film')
  async watchFilm(@Param('id') id: string, @Req() req): Promise<object> {
    const film = await this.filmsService.findOne(id);
    const isPurchased = await this.filmsService.isPurchased(id, req.user.id);

    if (!isPurchased) {
      return;
    }

    return { video_url: film.video_url };
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  getUserBalance(@Req() req): object {
    return { balance: req.user.balance };
  }
}
