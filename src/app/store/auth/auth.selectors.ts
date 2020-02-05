import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { AuthState } from './auth.state';
import { User } from '../../shared/models/user.model';
import { authFeatureKey } from './auth.reducer';

const getIsAuthenticated = (state: AuthState): boolean => state.isAuthenticated;
const getUser = (state: AuthState): User => state.user;
const getErrorMessage = (state: AuthState): string => state.errorMessage;
const getCart = (state: AuthState): any[] => state.cart;
const getCart2 = (state: AuthState): any[] => state.cart2;

export const selectAuthState: MemoizedSelector<object, AuthState> = createFeatureSelector<AuthState>(authFeatureKey);
export const selectAuthIsAuthenticated: MemoizedSelector<object, boolean> = createSelector(selectAuthState, getIsAuthenticated);
export const selectAuthUser: MemoizedSelector<object, User> = createSelector(selectAuthState, getUser);
export const selectAuthErrorMessage: MemoizedSelector<object, string> = createSelector(selectAuthState, getErrorMessage);
export const selectAuthCart: MemoizedSelector<object, any[]> = createSelector(selectAuthState, getCart);
export const selectAuthCart2: MemoizedSelector<object, any[]> = createSelector(selectAuthState, getCart2);
