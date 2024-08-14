import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import e from 'express';
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
        if (Array.isArray(error.message)) {
          error.message = error.message[0];
        }

        return throwError(() => ({
          status: 'error',
          message: error.message || 'An unknown error occurred',
          data: null,
        }));
      }),
    );
  }
}
