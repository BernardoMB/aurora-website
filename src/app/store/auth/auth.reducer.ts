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
        errorMessage: null
    })),
    on(AuthActions.loginFailure, (state: AuthState, { error, message }) => ({
        ...state,
        errorMessage: message,
    })),
    on(AuthActions.getUserInfoSuccess, (state: AuthState, { id, email, username, emailVerified }) => {
        return {
          ...state,
          user: { id, email, username, emailVerified },
        }
      }
    ),
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
