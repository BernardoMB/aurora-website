import { createAction, props } from '@ngrx/store';

export const login = createAction(
    '[Auth] Login',
    props<{ email: string; password: string }>(),
);
export const loginSuccess = createAction(
    '[Auth] LoginSuccess',
    props<{ token: string }>(),
);
export const loginFailure = createAction(
    '[Auth] LoginSuccess',
    props<{ error: any }>(),
);

export const getUserInfo = createAction(
    '[Auth] GetUserInfo',
    props<{ token: string }>(),
);
export const getUserInfoSuccess = createAction(
    '[Auth] GetUserInfoSuccess',
    props<{ id: string; email: string; username: string; token: string; emailVerified: string; }>(),
);
export const getUserInfoFailure = createAction(
    '[Auth] GetUserInfoFailure',
    props<{ error: any }>(),
);

export const signup = createAction('[Auth] Signup', props<{}>());
export const signupSuccess = createAction('[Auth] SignupSuccess', props<{}>());
export const signupFailure = createAction('[Auth] SignupFailure', props<{ error: any }>());

export const logout = createAction('[Auth] Logout', props<{}>());
export const logoutSuccess = createAction('[Auth] LogoutSuccess', props<{}>());
export const logoutFailure = createAction('[Auth] LogoutFailure', props<{}>());

export const getStatus = createAction('[Auth] GetStatus', props<{}>());

export const loginWithToken = createAction(
    '[Auth] LoginWithToken',
    props<{ token: string }>(),
);
export const loginWithTokenSuccess = createAction(
    '[Auth] LoginWithTokenSuccess',
    props<{ token: string }>(),
);
export const loginWithTokenFailure = createAction(
    '[Auth] LoginWithTokenSuccess',
    props<{ error: any }>(),
);
