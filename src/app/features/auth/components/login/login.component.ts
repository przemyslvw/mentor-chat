import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Logowanie</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="Wprowadź email"
                required
              />
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email jest wymagany
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Wprowadź poprawny adres email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Hasło</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                placeholder="Wprowadź hasło"
                required
              />
              <button
                type="button"
                mat-icon-button
                matSuffix
                (click)="hidePassword = !hidePassword"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hidePassword"
              >
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Hasło jest wymagane
              </mat-error>
              <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                Hasło musi mieć co najmniej 6 znaków
              </mat-error>
            </mat-form-field>

            <div class="forgot-password">
              <a [routerLink]="['/auth/forgot-password']" class="forgot-password-link">
                Zapomniałeś hasła?
              </a>
            </div>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="!loginForm.valid || isLoading"
              class="full-width"
            >
              <span *ngIf="!isLoading">Zaloguj się</span>
              <mat-spinner *ngIf="isLoading" diameter="24"></mat-spinner>
            </button>

            <div class="register-link">
              Nie masz jeszcze konta?
              <a [routerLink]="['/auth/register']">Zarejestruj się</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        padding: 1rem;
      }

      .login-card {
        width: 100%;
        max-width: 400px;
        padding: 2rem;
      }

      .full-width {
        width: 100%;
        margin-bottom: 1rem;
      }

      .forgot-password {
        text-align: right;
        margin-bottom: 1.5rem;
      }

      .forgot-password-link {
        color: #3f51b5;
        text-decoration: none;
        font-size: 0.875rem;
      }

      .register-link {
        margin-top: 1.5rem;
        text-align: center;
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);
      }

      .register-link a {
        color: #3f51b5;
        text-decoration: none;
        font-weight: 500;
      }

      mat-spinner {
        margin: 0 auto;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      error: error => {
        this.errorMessage = error?.message || 'Nieprawidłowy email lub hasło';
        console.error('Login error:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
