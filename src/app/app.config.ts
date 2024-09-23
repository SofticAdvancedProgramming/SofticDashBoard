import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxPermissionsModule } from 'ngx-permissions';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SpinnerInterceptor } from './core/services/interceptor/spinner/spinner.interceptor';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from './environment/environment';
import { MessagingService } from './services/messaging-service/messaging.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations(),
    importProvidersFrom(NgxPermissionsModule.forRoot()), provideAnimationsAsync(),
    provideToastr(),
    importProvidersFrom(
      NgxPermissionsModule.forRoot(),
      TranslateModule.forRoot({
        defaultLanguage: typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ar' : 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ), // Imports from external libraries
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    },
        // FCM FireBase
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideMessaging(() => getMessaging()),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        MessagingService
  ]
};

export function HttpLoaderFactory(http: HttpClient) { return new TranslateHttpLoader(http, 'assets/i18n/', '.json') }
