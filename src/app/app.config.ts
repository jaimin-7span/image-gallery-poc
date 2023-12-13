import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    {
      provide: FIREBASE_OPTIONS,
      useValue: {
        apiKey: 'AIzaSyCEsasPHU3nGeUnsKKXbnUrW3BpKYClZSM',
        authDomain: 'notify-be8dd.firebaseapp.com',
        projectId: 'notify-be8dd',
        storageBucket: 'notify-be8dd.appspot.com',
        messagingSenderId: '312238653480',
        appId: '1:312238653480:web:e7ed7cd3ba6283c376b51d',
      },
    },
  ],
};
