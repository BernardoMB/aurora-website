import * as AuthActions from './auth.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { initialAuthState, AuthState } from './auth.state';
import { User, IPurchasedCourse } from '../../shared/models/user.model';
import { Course } from '../../shared/models/course.model';

export const authFeatureKey = 'auth';

const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginSuccess, (state: AuthState) => ({
    ...state,
    // isAuthenticated: true,
    errorMessage: null,
  })),
  on(AuthActions.loginFailure, (state: AuthState, { error, message }) => ({
    ...state,
    errorMessage: message,
  })),
  on(AuthActions.getUserInfoSuccess, (state: AuthState, payload: { user: User }) => {
    return {
      ...state,
      isAuthenticated: true,
      user: payload.user,
      cart: payload.user.cart
    };
  }),
  on(AuthActions.signupFailure, (state: AuthState, { error }) => ({
    ...state,
    errorMessage: error.message, // TODO: Implement correct error handling
  })),
  on(AuthActions.loginWithTokenSuccess, (state: AuthState) => ({
    ...state,
    // isAuthenticated: true,
  })),
  on(AuthActions.loginWithTokenFailure, (state: AuthState, { error }) => ({
    ...state,
    errorMessage: 'Session is no longer valid.',
  })),
  on(AuthActions.logout, () => initialAuthState),
  on(AuthActions.addCourseToCartSuccess, (state: AuthState, payload: { course: Course }) => {
    if (state.user) {
      return {
        ...state,
        user: {
          ...(state.user),
          cart: [
            ...(state.user.cart),
            payload.course
          ]
        },
        cart: [
          ...(state.cart),
          payload.course
        ]
      };
    }
  }),
  on(AuthActions.removeCourseFromCartSuccess, (state: AuthState, payload: { course: Course }) => {
    console.log('EXECUTING REDUCER');
    const newUserCart = state.user.cart.filter((el: Course) => {
      return el.id !== payload.course.id;
    });
    const newCart = state.cart.filter((el: Course) => {
      return el.id !== payload.course.id;
    });
    return {
      ...state,
      user: {
        ...(state.user),
        cart: newUserCart
      },
      cart: newCart
    };
  }),
  on(AuthActions.addCoursesToCartSuccess, (state: AuthState, payload: { user: User }) => {
    return {
      ...state,
      user: {
        ...(payload.user)
      },
      cart2: [],
      cart: payload.user.cart
    };
  }),
  on(AuthActions.getCoursesFrommCookiesSuccess, (state: AuthState, payload: {courses: Course[]} ) => {
    return {
      ...state,
      cart: [...(state.cart), ...(payload.courses)],
      cart2: [...(state.cart2), ...(payload.courses)]
    };
  }),
  on(AuthActions.pushCourseToCarts, (state: AuthState, payload: { course: Course }) => {
    return {
      ...state,
      cart: [...(state.cart), payload.course],
      cart2: [...(state.cart2), payload.course]
    };
  }),
  on(AuthActions.removeCourseFromCartSuccess, (state: AuthState, payload: { course: Course }) => {
    const userCart = state.user.cart;
    const newUserCart = userCart.filter((el: Course) => el.id !== payload.course.id);
    const cart = state.cart;
    const newCart = cart.filter((el: Course) => el.id !== payload.course.id);
    return {
      ...state,
      user: {
        ...(state.user),
        cart: newUserCart
      },
      cart: newCart
    };
  }),
  on(AuthActions.pullCourseFromCarts, (state: AuthState, payload: { course: Course }) => {
    const newCart = state.cart.filter((el: Course) => el.id !== payload.course.id);
    const newCart2 = state.cart2.filter((el: Course) => el.id !== payload.course.id);
    return {
      ...state,
      cart: newCart,
      cart2: newCart2
    };
  }),
  on(AuthActions.purchaseCartSuccess, (state: AuthState, user: User) => {
    return {
      ...state,
      user,
      cart: [],
      cart2: []
    };
  }),
  on(AuthActions.purchaseCourseSuccess, (state: AuthState, payload: { course: Course }) => {
    // Pull out the just purchased course from all carts
    const cart = state.cart.filter(el => el.id !== payload.course.id);
    const cart2 = state.cart2.filter(el => el.id !== payload.course.id);
    const userCart = state.user.cart.filter(el => el.id !== payload.course.id);
    return {
      ...state,
      user: {
        ...(state.user),
        courses: [
          ...(state.user.courses),
          payload.course.id
        ],
        purchasedCourses: [
          ...(state.user.purchasedCourses),
          {
            course: payload.course.id,
            progress: []
          }
        ],
        cart: userCart
      },
      cart,
      cart2
    };
  }),
  on(AuthActions.completeLessonSuccess, (state: AuthState, payload: { courseId: string, lessonId: string }) => {
    const purchasedCourse = state.user.purchasedCourses.filter((el: IPurchasedCourse) => el.course === payload.courseId)[0];
    const progress = [ ...(purchasedCourse.progress), payload.lessonId ];
    const newPurchasedcourse = {
      course: payload.courseId,
      progress
    };
    const purchasedCourses = state.user.purchasedCourses.filter((el: IPurchasedCourse) => el.course !== payload.courseId);
    return {
      ...state,
      user: {
        ...(state.user),
        purchasedCourses: [
          ...purchasedCourses,
          newPurchasedcourse
        ]
      }
    };

  }),
  on(AuthActions.addCourseToFavoritesSuccess, (state: AuthState, payload: { courseId: string }) => {
    return {
      ...state,
      user: {
        ...(state.user),
        favoriteCourses: [
          ...(state.user.favoriteCourses),
          payload.courseId
        ]
      }
    };
  }),
  on(AuthActions.removeCourseFromFavoritesSuccess, (state: AuthState, payload: { courseId: string }) => {
    const favoriteCourses = state.user.favoriteCourses.filter((id: string) => id !== payload.courseId);
    return {
      ...state,
      user: {
        ...(state.user),
        favoriteCourses
      }
    };
  }),
  on(AuthActions.addCourseToWishlistSuccess, (state: AuthState, payload: { courseId: string }) => {
    return {
      ...state,
      user: {
        ...(state.user),
        wishList: [
          ...(state.user.wishList),
          payload.courseId
        ]
      }
    };
  }),
  on(AuthActions.removeCourseFromWishlistSuccess, (state: AuthState, payload: { courseId: string }) => {
    const wishList = state.user.wishList.filter((id: string) => id !== payload.courseId);
    return {
      ...state,
      user: {
        ...(state.user),
        wishList
      }
    };
  }),
  on(AuthActions.addCourseToArchiveSuccess, (state: AuthState, payload: { courseId: string }) => {
    return {
      ...state,
      user: {
        ...(state.user),
        archivedCourses: [
          ...(state.user.archivedCourses),
          payload.courseId
        ]
      }
    };
  }),
  on(AuthActions.removeCourseFromArchiveSuccess, (state: AuthState, payload: { courseId: string }) => {
    const archivedCourses = state.user.archivedCourses.filter((id: string) => id !== payload.courseId);
    return {
      ...state,
      user: {
        ...(state.user),
        archivedCourses
      }
    };
  }),
  on(AuthActions.updateProfileInfoSuccess, (state: AuthState, user: User) => {
    return {
      ...state,
      user
    };
  }),
  on(AuthActions.changeUsernameSuccess, (state: AuthState, user: User) => {
    return {
      ...state,
      user
    };
  }),
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
