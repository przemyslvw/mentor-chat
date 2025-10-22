import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { errorInterceptor } from './core/interceptors/error/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading/loading.interceptor';
import { LoadingService } from './core/services/loading.service';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation(), withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          // First apply loading interceptor
          return loadingInterceptor(req, req =>
            // Then apply error interceptor
            errorInterceptor(req, next),
          );
        },
      ]),
    ),
    LoadingService,
    MatSnackBarModule,
    provideAnimations(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'mentor-chat-9a1c2',
        appId: '1:315578043612:web:5c9b9c5b5e3e3c5e8b8b9a',
        storageBucket: 'mentor-chat-9a1c2.appspot.com',
        apiKey: 'AIzaSyB4kXfzXQZ1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1',
        authDomain: 'mentor-chat-9a1c2.firebaseapp.com',
        messagingSenderId: '315578043612',
      }),
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'zapytaj-6fbcc',
        appId: '1:165410793587:web:90820ac245356f09e56206',
        storageBucket: 'zapytaj-6fbcc.firebasestorage.app',
        apiKey: 'AIzaSyBN2AuxwXevQrpj4xTTgM5WELD872OgGTA',
        authDomain: 'zapytaj-6fbcc.firebaseapp.com',
        messagingSenderId: '165410793587',
        measurementId: 'G-KQGKPRB6PJ',
        projectNumber: '165410793587',
        version: '2',
      }),
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
};
