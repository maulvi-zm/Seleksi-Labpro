import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DynamicCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const { q, page, limit } = request.query;
    const userId = request.user.id;
    const path = request.path;

    const cacheKey = `${path}?q=${q || ''}&page=${page || 1}&limit=${limit || 9}&userId=${userId}`;

    const cachedResponse = await this.cacheManager.get(cacheKey);
    if (cachedResponse) {
      console.log('Cache hit');
      return new Observable((observer) => {
        observer.next(cachedResponse);
        observer.complete();
      });
    }

    console.log('Cache miss');
    return next.handle().pipe(
      tap((responseData) => {
        this.cacheManager.set(cacheKey, responseData);
      }),
    );
  }
}
