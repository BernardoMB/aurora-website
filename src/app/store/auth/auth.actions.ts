import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/user.model';
import { SignupDto } from '../../shared/dtos/signup.dto';
import { GetUserDto } from '../../shared/dtos/get-user.dto';

export const login = createAction(
    '[Auth] Login',
    props<{ username: string; password: string }>(),
);
export const loginSuccess = createAction('[Auth] LoginSuccess');
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
    props<User>(),
);
export const getUserInfoFailure = createAction(
    '[Auth] GetUserInfoFailure',
    props<{ error: any }>(),
);

export const signup = createAction('[Auth] Signup', props<SignupDto>());
export const signupSuccess = createAction(
    '[Auth] SignupSuccess',
    props<GetUserDto>(),
);
export const signupFailure = createAction(
    '[Auth] SignupFailure',
    props<{ error: any }>(),
);

export const getStatus = createAction('[Auth] GetStatus', props<{}>());

export const loginWithToken = createAction('[Auth] LoginWithToken');
export const loginWithTokenSuccess = createAction(
    '[Auth] LoginWithTokenSuccess',
);
export const loginWithTokenFailure = createAction(
    '[Auth] LoginWithTokenSuccess',
    props<{ error: any }>(),
);

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] LogoutSuccess');
export const logoutFailure = createAction('[Auth] LogoutFailure');
