import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LandingComponent } from './components/landing/landing.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CookieService } from 'ngx-cookie-service';
import { RootStoreModule } from './store/root-store.module';
import { WINDOW_PROVIDERS } from './providers/window.provider';
import { DOCUMENT_PROVIDERS } from './providers/document.provider';
import { AuthService } from './services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
    TokenInterceptor,
    ErrorInterceptor,
} from './services/token.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        LandingComponent,
        FooterComponent,
        NotFoundComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule, // Making Http call within the app
        AppRoutingModule, // <-- Routing modules should be imported in the correct order.c
        RootStoreModule,
    ],
    providers: [
        ...DOCUMENT_PROVIDERS, // For header sections logic
        ...WINDOW_PROVIDERS, // For headers sections logic
        CookieService, // Service to store and retreive cookies
        AuthService, // Auth service is an app level service
        {
            // Interceptor
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        {
            // Interceptor
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
