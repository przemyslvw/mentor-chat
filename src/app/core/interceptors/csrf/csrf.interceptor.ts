import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Pobierz token CSRF z cookies
    const csrfToken = this.getCookie('XSRF-TOKEN');

    // Jeśli mamy token i żądanie nie jest typu GET/HEAD/OPTIONS, dodaj nagłówek
    if (csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      request = request.clone({
        setHeaders: {
          'X-XSRF-TOKEN': csrfToken,
          // Dodatkowe nagłówki zabezpieczające
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'Content-Security-Policy':
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;",
        },
      });
    }

    return next.handle(request);
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
}
