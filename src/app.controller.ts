import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { FilmsService } from './films/films.service';
import { ApiExcludeController, ApiOkResponse } from '@nestjs/swagger';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { LoginDto } from './auth/dto/login.dto';
import { AuthEntity } from './auth/entities/auth.entity';
import { CreateUserDto } from './users/dto/create-user.dto';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { DynamicCacheInterceptor } from './common/interceptors/DynamicCacheInterceptor';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly filmsService: FilmsService,
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get()
  @Render('index')
  getHello(@Req() req): object {
    const isAuthenticated = req.cookies.token ? true : false;
    return { isAuthenticated: isAuthenticated };
  }

  @Get('login')
  getLogin(@Req() req, @Res() res): void {
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
      res.render('login', {
        message: error.message,
        status: 'error',
        data: { stylesheets: ['register.css'] },
      });
    }
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

  @Get(['films', 'my-films', 'wishlist'])
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(DynamicCacheInterceptor)
  @CacheTTL(60 * 1000)
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
      scripts: ['films.js'],
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
