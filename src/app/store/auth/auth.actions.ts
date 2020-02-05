import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/user.model';
import { SignupDto } from '../../shared/dtos/signup.dto';
import { GetUserDto } from '../../shared/dtos/get-user.dto';
import { Course } from '../../shared/models/course.model';

export const login = createAction(
    '[Auth] Login',
    props<{ username: string; password: string }>(),
);
export const loginSuccess = createAction('[Auth] LoginSuccess');
export const loginFailure = createAction(
    '[Auth] LoginFailure',
    props<{ error: any; message: string }>(),
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

export const addCourseToCart = createAction('[Auth] AddCourseToCart', props<{courseId: string, userId: string}>());
export const addCourseToCartSuccess = createAction('[Auth] AddCourseToCartSuccess', props<Course>());
export const addCourseToCartFailure = createAction('[Auth] AddCourseToCartFailure', props<{ error: any; message: string }>());

export const removeCourseFromCart = createAction('[Auth] RemoveCourseFromCart', props<{courseId: string, userId: string}>());
export const removeCourseFromCartSuccess = createAction('[Auth] RemoveCourseFromCartSuccess', props<Course>());
export const removeCourseFromCartFailure = createAction('[Auth] RemoveCourseFromCartFailure', props<{ error: any; message: string }>());

export const addCourseToCartNoAuth = createAction('[Auth] AddCourseToCartNoAuth', props<{courseId: string}>());
export const addCourseToCartNoAuthSuccess = createAction('[Auth] AddCourseToCartNoAuthSuccess', props<Course>());
export const addCourseToCartNoAuthFailure = createAction('[Auth] AddCourseToCartNoAuthFailure', props<{}>());

export const addCoursesToCart = createAction('[Auth] AddCoursesToCart', props<{courses: Course[]}>());
export const addCoursesToCartSuccess = createAction('[Auth] AddCoursesToCartSuccess', props<User>());
export const addCoursesToCartFailure = createAction('[Auth] AddCoursesToCartFailure', props<{ error: any; message: string }>()); // TODO: Error handling

export const getCoursesFrommCookies = createAction('[Auth] GetCoursesFromCookies', props<{courseIds: string[]}>());
export const getCoursesFrommCookiesSuccess = createAction('[Auth] GetCoursesFromCookiesSuccess', props<{courses: Course[]}>());
export const getCoursesFrommCookiesFailure = createAction('[Auth] GetCoursesFromCookiesFailure', props<{ error: any; message: string }>()); // TODO: Error handling

export const pushCourseToCarts = createAction('[Auth] PushCourseToCarts', props<Course>());
export const pullCourseFromCarts = createAction('[Auth] PullCourseFromCarts', props<Course>());
