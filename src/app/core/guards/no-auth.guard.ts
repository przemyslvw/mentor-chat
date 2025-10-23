import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise<boolean | import('@angular/router').UrlTree>(resolve => {
    // Create a subscription with proper type
    const subscription = authService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          // Jeśli użytkownik jest zalogowany, przekieruj do strony głównej
          resolve(router.parseUrl('/chat'));
        } else {
          // Jeśli użytkownik nie jest zalogowany, zezwól na dostęp
          resolve(true);
        }
        // Unsubscribe after we're done
        if (subscription) {
          subscription.unsubscribe();
        }
      },
      error: error => {
        console.error('Error in noAuthGuard:', error);
        // W przypadku błędu, zezwól na dostęp do ścieżki (bezpieczniejsze)
        resolve(true);
        if (subscription) {
          subscription.unsubscribe();
        }
      },
    });
  });
};
