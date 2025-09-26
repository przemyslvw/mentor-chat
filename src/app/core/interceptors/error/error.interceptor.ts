import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export function errorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'No internet connection or server is down';
      } else if (error.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found';
      } else if (error.status >= 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      }

      showError(snackBar, errorMessage);
      return throwError(() => error);
    })
  );
}

function showError(snackBar: MatSnackBar, message: string): void {
  snackBar.open(message, 'Close', {
    duration: 5000,
    panelClass: ['error-snackbar'],
    horizontalPosition: 'right',
    verticalPosition: 'top',
  });
}
