import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"zapytaj-6fbcc","appId":"1:165410793587:web:90820ac245356f09e56206","storageBucket":"zapytaj-6fbcc.firebasestorage.app","apiKey":"AIzaSyBN2AuxwXevQrpj4xTTgM5WELD872OgGTA","authDomain":"zapytaj-6fbcc.firebaseapp.com","messagingSenderId":"165410793587","measurementId":"G-KQGKPRB6PJ"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFunctions(() => getFunctions())]
};
