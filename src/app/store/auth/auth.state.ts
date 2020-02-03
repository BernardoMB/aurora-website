import { User } from '../../shared/models/user.model';
import { Course } from '../../shared/models/course.model';

export interface AuthState {
    // is a user authenticated?
    isAuthenticated: boolean;
    // if authenticated, there should be a user object
    user: User | null;
    // error message
    errorMessage: string | null;
    // Cart
    cart: Course[];
}

export const initialAuthState: AuthState = {
    isAuthenticated: false,
    user: null,
    errorMessage: null,
    cart: []
};
