import * as AuthActions from './auth.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { initialAuthState, AuthState } from './auth.state';
import { User } from '../../shared/models/user.model';

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
    on(AuthActions.getUserInfoSuccess, (state: AuthState, payload: User) => ({
        ...state,
        user: { ...payload },
    })),
    on(AuthActions.signupFailure, (state: AuthState, { error }) => ({
        ...state,
        errorMessage: error.message, // TODO: Implement correct error handling
    })),
    on(AuthActions.loginWithTokenSuccess, (state: AuthState) => ({
        ...state,
        isAuthenticated: true,
    })),
    on(AuthActions.loginWithTokenFailure, (state: AuthState, { error }) => ({
        ...state,
        errorMessage: 'Session is no longer valid.',
    })),
    on(AuthActions.logout, () => initialAuthState),
);

export function reducer(state: AuthState | undefined, action: Action) {
    return authReducer(state, action);
}
