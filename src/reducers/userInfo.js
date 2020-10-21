import { combineReducers } from 'redux';
import { cleanWhenNoUser } from './utils';

export const userInfoReducer = combineReducers({
  user: (state = null, action) => (action.type === 'SET_USER' ? (action.user || null) : state),
  anonymousAccess: cleanWhenNoUser((state = false, action) => (action.type === 'SET_ANONYMOUS_ACCESS' ? action.anonymousAccess : state)),
});
