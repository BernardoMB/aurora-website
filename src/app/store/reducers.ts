import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

export const reducers: ActionReducerMap<{}> = {};

// console.log all actions
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    return (state, action) => {
        console.log('state', state);
        console.log('action', action);
        return reducer(state, action);
    };
}

// * If enriconment is production, logging every action will be disabled`
export const metaReducers: MetaReducer<{}>[] = !environment.production
    ? [/* debug */]
    : [];
