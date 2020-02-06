import * as AuthActions from './auth.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { initialAuthState, AuthState } from './auth.state';
import { User } from '../../shared/models/user.model';
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
  on(AuthActions.getUserInfoSuccess, (state: AuthState, user: User) => {
    return {
      ...state,
      isAuthenticated: true,
      user,
      cart: user.cart
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
  on(AuthActions.addCourseToCartSuccess, (state: AuthState, course: Course) => {
    if (state.user) {
      return {
        ...state,
        user: {
          ...(state.user),
          cart: [
            ...(state.user.cart),
            course
          ]
        },
        cart: [
          ...(state.cart),
          course
        ]
      };
    }
  }),
  on(AuthActions.removeCourseFromCartSuccess, (state: AuthState, course: Course) => {
    console.log('EXECUTING REDUCER');
    const newUserCart = state.user.cart.filter((el: Course) => {
      console.log(el);
      console.log(course);
      return el.id !== course.id;
    });
    const newCart = state.cart.filter((el: Course) => {
      console.log(el);
      console.log(course);
      return el.id !== course.id;
    });

    console.log(state.cart.length);
    console.log(newCart.length);
    return {
      ...state,
      user: {
        ...(state.user),
        cart: newUserCart
      },
      cart: newCart
    };
  }),
  on(AuthActions.addCoursesToCartSuccess, (state: AuthState, user: User) => {
    return {
      ...state,
      user: {
        ...user
      },
      cart2: [],
      cart: user.cart
    }
  }),
  on(AuthActions.getCoursesFrommCookiesSuccess, (state: AuthState, payload: {courses: Course[]} ) => {
    return {
      ...state,
      cart: [...(state.cart), ...(payload.courses)],
      cart2: [...(state.cart2), ...(payload.courses)]
    }
  }),
  on(AuthActions.pushCourseToCarts, (state: AuthState, course: Course) => {
    return {
      ...state,
      cart: [...(state.cart), course],
      cart2: [...(state.cart2), course]
    };
  }),
  on(AuthActions.removeCourseFromCartSuccess, (state: AuthState, course: Course) => {
    const userCart = state.user.cart;
    const newUserCart = userCart.filter((el: Course) => el.id !== course.id);
    const cart = state.cart;
    const newCart = cart.filter((el: Course) => el.id !== course.id);
    return {
      ...state,
      user: {
        ...(state.user),
        cart: newUserCart
      },
      cart: newCart
    };
  }),
  on(AuthActions.pullCourseFromCarts, (state: AuthState, course: Course) => {
    const newCart = state.cart.filter((el: Course) => el.id !== course.id);
    const newCart2 = state.cart2.filter((el: Course) => el.id !== course.id);
    return {
      ...state,
      cart: newCart,
      cart2: newCart2
    };
  }),
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
