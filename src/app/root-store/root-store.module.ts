import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStoreModule } from './auth/auth.store.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { environment } from '../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { metaReducers } from './reducers';

@NgModule({
    declarations: [],
    imports: [
      CommonModule,
      StoreModule.forRoot(reducers, {
        metaReducers,
        runtimeChecks: {
            strictStateImmutability: true,
            strictActionImmutability: true,
        },
      }),
      StoreRouterConnectingModule.forRoot(),
      StoreDevtoolsModule.instrument({
        maxAge: 25, // Retains last 25 states
        logOnly: environment.production, // Restrict extension to log-only mode
      }),
      AuthStoreModule
    ],
})
export class RootStoreModule {}
