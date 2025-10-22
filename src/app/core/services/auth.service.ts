import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  User,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));

  constructor() {
    // Sprawdzanie stanu autentykacji przy starcie aplikacji
    onAuthStateChanged(this.auth, user => {
      this.currentUserSubject.next(user);
    });
  }

  // Rejestracja nowego użytkownika
  register(email: string, password: string): Observable<User | null> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential: UserCredential) => {
        this.showSuccess('Rejestracja zakończona pomyślnie!');
        this.router.navigate(['/auth/login']);
        return userCredential.user;
      }),
      catchError(error => {
        this.handleError(error);
        return of(null);
      }),
    );
  }

  // Logowanie użytkownika
  login(email: string, password: string): Observable<User | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential: UserCredential) => {
        this.showSuccess('Zalogowano pomyślnie!');
        this.router.navigate(['/chat']);
        return userCredential.user;
      }),
      catchError(error => {
        this.handleError(error);
        return of(null);
      }),
    );
  }

  // Wylogowanie użytkownika
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.router.navigate(['/auth/login']);
        this.showSuccess('Wylogowano pomyślnie!');
      }),
      catchError(error => {
        this.handleError(error);
        return of(undefined);
      }),
    );
  }

  // Resetowanie hasła
  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      map(() => {
        this.showSuccess('Link do resetowania hasła został wysłany na podany adres email');
      }),
      catchError(error => {
        this.handleError(error);
        return of(undefined);
      }),
    );
  }

  // Pobierz aktualnie zalogowanego użytkownika
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Obsługa błędów
  private handleError(error: { code?: string; message?: string }): void {
    console.error('Auth error:', error);
    let errorMessage = 'Wystąpił błąd podczas przetwarzania żądania';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Ten adres email jest już w użyciu';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Nieprawidłowy adres email';
        break;
      case 'auth/weak-password':
        errorMessage = 'Hasło jest zbyt słabe';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Nieprawidłowy email lub hasło';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Zbyt wiele prób logowania. Spróbuj później';
        break;
    }

    this.showError(errorMessage);
  }

  // Wyświetlanie komunikatów sukcesu
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  // Wyświetlanie komunikatów błędów
  private showError(message: string): void {
    this.snackBar.open(message, 'Zamknij', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
