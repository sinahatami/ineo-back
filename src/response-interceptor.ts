import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (data === null || data === undefined) {
                    return { message: 'Operation successful', data: [] };
                }

                if (data.message) {
                    return data;
                }

                return { message: 'Operation successful', data: data }
            }),
            catchError((error) => {
                const status =
                    error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

                const response = context.switchToHttp().getResponse();
                response.status(status).json({
                    statusCode: status,
                    message: error.message || 'An unexpected error occurred',
                    error: error.response || null,
                });

                return throwError(() => error);
            }),
        )
    }
}
