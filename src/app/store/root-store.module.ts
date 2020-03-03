import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStoreModule } from './auth/auth.store.module';
import { StoreModule } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forRoot(
            {},
            {
                metaReducers,
                runtimeChecks: {
                    strictStateImmutability: true,
                    strictActionImmutability: true,
                },
            },
        ),
        StoreRouterConnectingModule.forRoot({ routerState: RouterState.Minimal }), // This is because we have feature stores.
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict NgRx Dev Tools Extension functionality when running in production mode
        }),
        EffectsModule.forRoot([]),
        AuthStoreModule,
    ],
})
export class RootStoreModule {}
