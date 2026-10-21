import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(
    _: unknown,
    next: CallHandler<T & { message: string }>,
  ): Observable<unknown> {
    return next.handle().pipe(
      map(({ message, ...data }) => ({
        success: true,
        message,
        data,
      })),
    );
  }
}
