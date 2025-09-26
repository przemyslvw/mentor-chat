import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding()
    ),
    provideHttpClient(),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp({ 
      projectId: "mentor-chat-9a1c2", 
      appId: "1:315578043612:web:5c9b9c5b5e3e3c5e8b8b9a", 
      storageBucket: "mentor-chat-9a1c2.appspot.com", 
      apiKey: "AIzaSyB4kXfzXQZ1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1", 
      authDomain: "mentor-chat-9a1c2.firebaseapp.com", 
      messagingSenderId: "315578043612" 
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideAnimationsAsync()
  ]
};
