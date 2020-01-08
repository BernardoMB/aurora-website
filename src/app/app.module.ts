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
import { RootStoreModule } from './root-store/root-store.module';
import { WINDOW_PROVIDERS } from './providers/window.provider';
import { DOCUMENT_PROVIDERS } from './providers/document.provider';

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
        AppRoutingModule, // <-- Routing modules should be imported in the correct order.c
        RootStoreModule,
    ],
    providers: [CookieService, ...DOCUMENT_PROVIDERS, ...WINDOW_PROVIDERS],
    bootstrap: [AppComponent],
})
export class AppModule {}
