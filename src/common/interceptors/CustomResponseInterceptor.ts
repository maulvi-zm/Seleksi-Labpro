import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          status: 'success',
          message: 'Request was successful',
          data,
        };
      }),
      catchError((error) => {
        return throwError(() => ({
          status: 'error',
          message: error.response.message[0],
          data: null,
        }));
      }),
    );
  }
}
