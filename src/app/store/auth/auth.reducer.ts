import * as AuthActions from './auth.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { initialAuthState, AuthState } from './auth.state';

export const authFeatureKey = 'auth';

const authReducer = createReducer(
    initialAuthState,
    on(AuthActions.loginSuccess, (state: AuthState) => ({
        ...state,
        isAuthenticated: true,
    })),
    on(AuthActions.loginFailure, (state: AuthState, { error }) => ({
        ...state,
        errorMessage: 'Incorrect email and/or password.',
    })),
    on(
        AuthActions.getUserInfoSuccess,
        (state: AuthState, { id, email, username, emailVerified }) => ({
            ...state,
            user: { id, email, username, emailVerified },
        }),
    ),
    on(AuthActions.signupFailure, (state: AuthState, { error }) => ({
        ...state,
        errorMessage: error.message, // TODO: test this reducer
    })),
    on(AuthActions.logout, () => initialAuthState),
    on(AuthActions.loginWithTokenSuccess, (state: AuthState, { token }) => ({
        ...state,
        isAuthenticated: true,
    })),
    on(AuthActions.loginWithTokenFailure, (state: AuthState, { error }) => ({
        ...state,
        errorMessage: 'Incorrect email and/or password.',
    })),
);

export function reducer(state: AuthState | undefined, action: Action) {
    return authReducer(state, action);
}
