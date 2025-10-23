import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User as FirebaseUser,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UserMetadata } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));

  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private auth = inject(Auth);

  constructor() {
    // Sprawdzanie stanu autentykacji przy starcie aplikacji
    onAuthStateChanged(this.auth, firebaseUser => {
      if (firebaseUser) {
        const user = this.mapFirebaseUserToUser(firebaseUser);
        this.currentUserSubject.next(user);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
    const { uid, email, displayName, photoURL, emailVerified, providerData } = firebaseUser;
    const metadata: UserMetadata = {
      creationTime: firebaseUser.metadata.creationTime || undefined,
      lastSignInTime: firebaseUser.metadata.lastSignInTime || undefined,
    };

    return {
      uid,
      email: email || '',
      displayName: displayName || undefined,
      photoURL: photoURL || undefined,
      emailVerified,
      metadata,
      providerData: providerData.map(pd => ({
        uid: pd.uid,
        displayName: pd.displayName || undefined,
        email: pd.email || undefined,
        photoURL: pd.photoURL || undefined,
        providerId: pd.providerId,
      })),
    };
  }

  // Rejestracja nowego użytkownika
  register(email: string, password: string): Observable<User | null> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential: UserCredential) => {
        const user = this.mapFirebaseUserToUser(userCredential.user);
        this.showSuccess('Rejestracja zakończona pomyślnie!');
        this.router.navigate(['/auth/login']);
        return of(user);
      }),
      catchError((error: Error & { code?: string }) => {
        this.handleError(error);
        return of(null);
      }),
    );
  }

  // Logowanie użytkownika
  login(email: string, password: string): Observable<User | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential: UserCredential) => {
        const user = this.mapFirebaseUserToUser(userCredential.user);
        this.showSuccess('Zalogowano pomyślnie!');
        this.router.navigate(['/chat']);
        return user;
      }),
      catchError((error: Error & { code?: string }) => {
        this.handleError(error);
        return of(null);
      }),
    );
  }

  // Wylogowanie użytkownika
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.currentUserSubject.next(null);
        this.showSuccess('Wylogowano pomyślnie!');
        this.router.navigate(['/auth/login']);
        return undefined;
      }),
      catchError((error: Error & { code?: string }) => {
        this.handleError(error);
        return of(undefined);
      }),
    );
  }

  // Resetowanie hasła
  resetPassword(email: string): Observable<boolean> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      map(() => {
        this.showSuccess('Link do resetowania hasła został wysłany na podany adres email.');
        return true;
      }),
      catchError((error: Error & { code?: string }) => {
        this.handleError(error);
        return of(false);
      }),
    );
  }

  // Pobierz aktualnego użytkownika
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Pobierz token użytkownika
  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
  }

  // Pokaż komunikat o sukcesie
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  // Obsługa błędów
  private handleError(error: Error & { code?: string }): void {
    console.error('Auth error:', error);
    let errorMessage = 'Wystąpił błąd podczas wykonywania operacji.';

    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Podany adres email jest już zarejestrowany.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Podany adres email jest nieprawidłowy.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Operacja nie jest dozwolona.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Hasło jest zbyt słabe. Wprowadź co najmniej 6 znaków.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Nieprawidłowy email lub hasło.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'To konto zostało wyłączone. Skontaktuj się z administratorem.';
          break;
      }
    }

    this.snackBar.open(errorMessage, 'Zamknij', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
