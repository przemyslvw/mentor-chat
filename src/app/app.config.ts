import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { routes } from './app.routes';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { errorInterceptor } from './core/interceptors/error/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading/loading.interceptor';
import { LoadingService } from './core/services/loading.service';
import { environment } from '../environments/environment';

// Inicjalizacja Firebase
const firebaseApp = initializeApp(environment.firebase);
const auth = getAuth(firebaseApp);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation(), withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          // Najpierw interceptor ładowania
          return loadingInterceptor(req, req =>
            // Następnie interceptor błędów
            errorInterceptor(req, next),
          );
        },
      ]),
    ),
    LoadingService,
    importProvidersFrom(MatSnackBarModule),
    provideAnimations(),
    provideAnimationsAsync(),
    // Dostarczanie usług Firebase
    { provide: 'FIREBASE_APP', useValue: firebaseApp },
    { provide: 'FIREBASE_AUTH', useValue: auth },
    { provide: 'FIREBASE_FIRESTORE', useFactory: () => getFirestore(firebaseApp) },
    { provide: 'FIREBASE_FUNCTIONS', useFactory: () => getFunctions(firebaseApp) },
    { provide: 'FIREBASE_STORAGE', useFactory: () => getStorage(firebaseApp) },
  ],
};
