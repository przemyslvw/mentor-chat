import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { errorInterceptor } from './interceptors/error/error.interceptor';
import { loadingInterceptor } from './interceptors/loading/loading.interceptor';
import { CsrfInterceptor } from './interceptors/csrf/csrf.interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    AuthService,
    LoadingService,
    NoAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useValue: errorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useValue: loadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class CoreModule {}
