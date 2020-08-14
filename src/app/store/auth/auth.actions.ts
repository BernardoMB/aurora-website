import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/user.model';
import { SignupDto } from '../../shared/dtos/signup.dto';
import { Course } from '../../shared/models/course.model';
import { IPaymentInfo } from '../../shared/interfaces/payment-info.interface';

// TODO: Better Error handling

export const getStatus = createAction('[Auth] GetStatus', props<{}>());

// username can also be the email.
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
  props<{ user: User }>(),
);
export const getUserInfoFailure = createAction(
  '[Auth] GetUserInfoFailure',
  props<{ error: any }>(),
);

export const signup = createAction('[Auth] Signup', props<SignupDto>());
export const signupSuccess = createAction(
  '[Auth] SignupSuccess',
  props<{ user: User }>(),
);
export const signupFailure = createAction(
  '[Auth] SignupFailure',
  props<{ error: any }>(),
);

// No need to pass token as every request gets intercepted and gets the found token injected
export const loginWithToken = createAction('[Auth] LoginWithToken');
export const loginWithTokenSuccess = createAction(
  '[Auth] LoginWithTokenSuccess',
);
export const loginWithTokenFailure = createAction(
  '[Auth] LoginWithTokenFailure',
  props<{ error: any }>(),
);

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] LogoutSuccess');
export const logoutFailure = createAction('[Auth] LogoutFailure');

export const changeUserPassword = createAction(
  '[Auth] ChangeUserPassword',
  props<{
    password: string;
    newPassword: string;
    newPasswordConfirmation: string;
  }>(),
);
export const changeUserPasswordSuccess = createAction(
  '[Auth] ChangeUserPasswordSuccess',
); // No payload needed because the store should change after this.
export const changeUserPasswordFailure = createAction(
  '[Auth] ChangeUserPasswordFailure',
  props<{ error: any; message: string }>(),
);

export const changeUsername = createAction(
  '[Auth] ChangeUsername',
  props<{ username: string }>(),
);
export const changeUsernameSuccess = createAction(
  '[Auth] ChangeUsernameSuccess',
  props<User>(),
);
export const changeUsernameFailure = createAction(
  '[Auth] ChangeUsernameFailure',
  props<{ error: any; message: string }>(),
);

export const updateProfileInfo = createAction(
  '[Auth] UpdateProfileInfo',
  props<{
    profileInfo: { name?: string; lastName?: string; nameTitle?: string };
    userId: string;
  }>(),
);
export const updateProfileInfoSuccess = createAction(
  '[Auth] UpdateProfileInfoSuccess',
  props<User>(),
);
export const updateProfileInfoFailure = createAction(
  '[Auth] UpdateProfileInfoFailure',
  props<{ error: any; message: string }>(),
);

export const addCourseToCart = createAction(
  '[Auth] AddCourseToCart',
  props<{ courseId: string; userId: string }>(),
);
export const addCourseToCartSuccess = createAction(
  '[Auth] AddCourseToCartSuccess',
  props<{ course: Course }>(),
);
export const addCourseToCartFailure = createAction(
  '[Auth] AddCourseToCartFailure',
  props<{ error: any; message: string }>(),
);

export const removeCourseFromCart = createAction(
  '[Auth] RemoveCourseFromCart',
  props<{ courseId: string; userId: string }>(),
);
export const removeCourseFromCartSuccess = createAction(
  '[Auth] RemoveCourseFromCartSuccess',
  props<{ course: Course }>(),
);
export const removeCourseFromCartFailure = createAction(
  '[Auth] RemoveCourseFromCartFailure',
  props<{ error: any; message: string }>(),
);

export const addCoursesToCart = createAction(
  '[Auth] AddCoursesToCart',
  props<{ courses: Course[] }>(),
);
export const addCoursesToCartSuccess = createAction(
  '[Auth] AddCoursesToCartSuccess',
  props<{ user: User }>(),
);
export const addCoursesToCartFailure = createAction(
  '[Auth] AddCoursesToCartFailure',
  props<{ error: any; message: string }>(),
);

export const getCoursesFrommCookies = createAction(
  '[Auth] GetCoursesFromCookies',
  props<{ courseIds: string[] }>(),
);
export const getCoursesFrommCookiesSuccess = createAction(
  '[Auth] GetCoursesFromCookiesSuccess',
  props<{ courses: Course[] }>(),
);
export const getCoursesFrommCookiesFailure = createAction(
  '[Auth] GetCoursesFromCookiesFailure',
  props<{ error: any; message: string }>(),
);

export const pushCourseToCarts = createAction(
  '[Auth] PushCourseToCarts',
  props<{ course: Course }>(),
);
export const pullCourseFromCarts = createAction(
  '[Auth] PullCourseFromCarts',
  props<{ course: Course }>(),
);

export const subscribeToEvent = createAction(
  '[Auth] SubscribeFromEvent',
  props<{ eventId: string }>(),
);
export const unsubscribeFromEvent = createAction(
  '[Auth] UnsubscribeFromEvent',
  props<{ eventId: string }>(),
);

export const likeArticle = createAction(
  '[Auth] LikeArticle',
  props<{ articleId: string }>(),
);
export const unlikeArticle = createAction(
  '[Auth] UnlikeArticle',
  props<{ articleId: string }>(),
);

export const dislikeArticle = createAction(
  '[Auth] DislikeArticle',
  props<{ articleId: string }>(),
);
export const undislikeArticle = createAction(
  '[Auth] UndislikeArticle',
  props<{ articleId: string }>(),
);

export const purchaseCart = createAction(
  '[Auth] PurchaseCart',
  props<{
    userId: string;
    courses: string[];
    paymentMethod: string;
    country: string;
    paymentInfo: IPaymentInfo;
  }>(),
);
export const purchaseCartSuccess = createAction(
  '[Auth] PurchaseCartSuccess',
  props<User>(),
);
export const purchaseCartFailure = createAction(
  '[Auth] PurchaseCartFailure',
  props<{ error: any; message: string }>(),
);

export const enrollCourse = createAction(
  '[Auth] EnrollCourse',
  props<{
    userId: string;
    courseId: string;
  }>(),
);
export const enrollCourseSuccess = createAction(
  '[Auth] EnrollCourseSuccess',
  props<Course>(),
);
export const enrollCourseFailure = createAction(
  '[Auth] EnrollCourseFailure',
  props<{ error: any; message: string }>(),
);

export const purchaseCourse = createAction(
  '[Auth] PurchaseCourse',
  props<{ course: string; userId: string }>(),
);
export const purchaseCourseSuccess = createAction(
  '[Auth] PurchaseCourseSuccess',
  props<{ course: Course }>(),
);
export const purchasecourseFailure = createAction(
  '[Auth] PurchaseCourseFailure',
  props<{ error: any; message: string }>(),
);

export const completeLesson = createAction(
  '[Auth] CompleteLesson',
  props<{ courseId: string; lessonId: string }>(),
);
export const completeLessonSuccess = createAction(
  '[Auth] CompleteLessonSuccess',
  props<{ courseId: string; lessonId: string }>(),
);
export const completeLessonFailure = createAction(
  '[Auth] CompleteLessonFailure',
  props<{ error: any; message: string }>(),
);

export const addCourseToFavorites = createAction(
  '[Auth] AddCourseToFavorites',
  props<{ courseId: string; userId: string }>(),
);
export const addCourseToFavoritesSuccess = createAction(
  '[Auth] AddCourseToFavoritesSuccess',
  props<{ courseId: string }>(),
);
export const addCourseToFavoritesFailure = createAction(
  '[Auth] AddCourseToFavoritesFailure',
  props<{ error: any; message: string }>(),
);

export const removeCourseFromFavorites = createAction(
  '[Auth] RemoveCourseFromFavorites',
  props<{ courseId: string; userId: string }>(),
);
export const removeCourseFromFavoritesSuccess = createAction(
  '[Auth] RemoveCourseFromFavoritesSuccess',
  props<{ courseId: string }>(),
);
export const removeCourseFromFavoritesFailure = createAction(
  '[Auth] RemoveCourseFromFavoritesFailure',
  props<{ error: any; message: string }>(),
);

export const addCourseToWishlist = createAction(
  '[Auth] AddCourseToWishlist',
  props<{ courseId: string; userId: string }>(),
);
export const addCourseToWishlistSuccess = createAction(
  '[Auth] AddCourseToWishlistSuccess',
  props<{ courseId: string }>(),
);
export const addCourseToWishlistFailure = createAction(
  '[Auth] AddCourseToWishlistFailure',
  props<{ error: any; message: string }>(),
);

export const removeCourseFromWishlist = createAction(
  '[Auth] RemoveCourseFromWishlist',
  props<{ courseId: string; userId: string }>(),
);
export const removeCourseFromWishlistSuccess = createAction(
  '[Auth] RemoveCourseFromWishlistSuccess',
  props<{ courseId: string }>(),
);
export const removeCourseFromWishlistFailure = createAction(
  '[Auth] RemoveCourseFromWishlistFailure',
  props<{ error: any; message: string }>(),
);

export const addCourseToArchive = createAction(
  '[Auth] AddCourseToArchive',
  props<{ courseId: string; userId: string }>(),
);
export const addCourseToArchiveSuccess = createAction(
  '[Auth] AddCourseToArchiveSuccess',
  props<{ courseId: string }>(),
);
export const addCourseToArchiveFailure = createAction(
  '[Auth] AddCourseToArchiveFailure',
  props<{ error: any; message: string }>(),
);

export const removeCourseFromArchive = createAction(
  '[Auth] RemoveCourseFromArchive',
  props<{ courseId: string; userId: string }>(),
);
export const removeCourseFromArchiveSuccess = createAction(
  '[Auth] RemoveCourseFromArchiveSuccess',
  props<{ courseId: string }>(),
);
export const removeCourseFromArchiveFailure = createAction(
  '[Auth] RemoveCourseFromArchiveFailure',
  props<{ error: any; message: string }>(),
);

export const addQuizToProgress = createAction(
  '[Auth] AddQuizToProgress',
  props<{ courseId: string; quizId: string }>(),
);
