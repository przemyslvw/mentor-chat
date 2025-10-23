import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { User } from '../../shared/models/user.model';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1), // Upewnij się, że bierzemy tylko jedną wartość
    map(user => {
      // Sprawdź, czy użytkownik jest zalogowany i jest administratorem
      const userWithClaims = user as User;
      const isAdmin = userWithClaims?.customClaims?.admin || userWithClaims?.isAdmin;

      if (isAdmin) {
        return true;
      }

      if (!user) {
        // Jeśli użytkownik nie jest zalogowany, przekieruj do logowania
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url },
        });
      } else {
        // Jeśli użytkownik jest zalogowany, ale nie ma uprawnień, przekieruj do strony głównej
        router.navigate(['/']);
      }

      return false;
    }),
  );
};
