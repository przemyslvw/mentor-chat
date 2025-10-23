import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        // Jeśli użytkownik jest zalogowany, przekieruj do strony głównej
        return router.parseUrl('/chat');
      }
      // Jeśli użytkownik nie jest zalogowany, zezwól na dostęp do strony logowania/rejestracji
      return true;
    }),
  );
};
