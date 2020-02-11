import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/user.model';
import { SignupDto } from '../../shared/dtos/signup.dto';
import { Course } from '../../shared/models/course.model';

// TODO: Error handling

export const getStatus = createAction('[Auth] GetStatus', props<{}>());

export const login = createAction('[Auth] Login', props<{ username: string; password: string }>());
export const loginSuccess = createAction('[Auth] LoginSuccess');
export const loginFailure = createAction('[Auth] LoginFailure', props<{ error: any; message: string }>(),);

export const getUserInfo = createAction('[Auth] GetUserInfo', props<{ token: string }>());
export const getUserInfoSuccess = createAction('[Auth] GetUserInfoSuccess', props<{ user: User }>(),);
export const getUserInfoFailure = createAction('[Auth] GetUserInfoFailure', props<{ error: any }>());

export const signup = createAction('[Auth] Signup', props<SignupDto>());
export const signupSuccess = createAction('[Auth] SignupSuccess', props<{ user: User }>());
export const signupFailure = createAction('[Auth] SignupFailure', props<{ error: any }>());

// No need to pass token as every request gets intercepted and gets the found token injected
export const loginWithToken = createAction('[Auth] LoginWithToken');
export const loginWithTokenSuccess = createAction('[Auth] LoginWithTokenSuccess');
export const loginWithTokenFailure = createAction('[Auth] LoginWithTokenSuccess', props<{ error: any }>());

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] LogoutSuccess');
export const logoutFailure = createAction('[Auth] LogoutFailure');

export const addCourseToCart = createAction('[Auth] AddCourseToCart', props<{ courseId: string, userId: string }>());
export const addCourseToCartSuccess = createAction('[Auth] AddCourseToCartSuccess', props<{ course: Course }>());
export const addCourseToCartFailure = createAction('[Auth] AddCourseToCartFailure', props<{ error: any; message: string }>());

export const removeCourseFromCart = createAction('[Auth] RemoveCourseFromCart', props<{ courseId: string, userId: string }>());
export const removeCourseFromCartSuccess = createAction('[Auth] RemoveCourseFromCartSuccess', props<{ course: Course }>());
export const removeCourseFromCartFailure = createAction('[Auth] RemoveCourseFromCartFailure', props<{ error: any; message: string }>());

export const addCoursesToCart = createAction('[Auth] AddCoursesToCart', props<{ courses: Course[] }>());
export const addCoursesToCartSuccess = createAction('[Auth] AddCoursesToCartSuccess', props<{ user: User}>());
export const addCoursesToCartFailure = createAction('[Auth] AddCoursesToCartFailure', props<{ error: any; message: string }>());

export const getCoursesFrommCookies = createAction('[Auth] GetCoursesFromCookies', props<{ courseIds: string[]}>());
export const getCoursesFrommCookiesSuccess = createAction('[Auth] GetCoursesFromCookiesSuccess', props<{ courses: Course[] }>());
export const getCoursesFrommCookiesFailure = createAction('[Auth] GetCoursesFromCookiesFailure', props<{ error: any; message: string }>());

export const pushCourseToCarts = createAction('[Auth] PushCourseToCarts', props<{ course: Course }>());
export const pullCourseFromCarts = createAction('[Auth] PullCourseFromCarts', props<{ course: Course }>());

export const purchaseCart = createAction('[Auth] PurchaseCart', props<{courses: string[], userId: string}>());
export const purchaseCartSuccess = createAction('[Auth] PurchaseCartSuccess', props<User>());
export const purchaseCartFailure = createAction('[Auth] PurchaseCartFailure', props<{ error: any; message: string }>());

export const purchaseCourse = createAction('[Auth] PurchaseCourse', props<{course: string, userId: string}>());
export const purchaseCourseSuccess = createAction('[Auth] PurchaseCourseSuccess', props<{ course: Course }>());
export const purchasecourseFailure = createAction('[Auth] PurchaseCourseFailure', props<{ error: any; message: string }>());
