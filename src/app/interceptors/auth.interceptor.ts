import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * HTTP Interceptor for JWT Authentication
 * Automatically attaches JWT token from localStorage to all HTTP requests
 * in the Authorization header as "Bearer <token>"
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('auth_token');

    console.log('[INTERCEPTOR] Token from localStorage:', token ? 'Present' : 'Missing');
    console.log('[INTERCEPTOR] Request URL:', request.url);

    // Clone the request and add Authorization header if token exists
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('[INTERCEPTOR] Authorization header added');
    } else {
      console.warn('[INTERCEPTOR] No token found - request will be sent without auth header');
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('[INTERCEPTOR] HTTP Error:', error.status, error.message);

        // Handle 401 Unauthorized responses
        if (error.status === 401) {
          // Token might be expired or invalid
          localStorage.removeItem('auth_token');
          console.warn('[INTERCEPTOR] 401 Unauthorized - Token removed from localStorage');
          // You can optionally redirect to login here
        }

        return throwError(() => error);
      })
    );
  }
}
