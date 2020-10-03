import { combineReducers } from 'redux';
import { cleanWhenNoUser } from './utils';

export const userInfoReducer = combineReducers({
  user: (state = null, action) => (action.type === 'SET_USER' ? (action.user || null) : state),
  accessAsAnonymous: cleanWhenNoUser((state = false, action) => (action.type === 'SET_ACCESS_AS_ANONYMOUS' ? action.accessAsAnonymous : state)),
});
