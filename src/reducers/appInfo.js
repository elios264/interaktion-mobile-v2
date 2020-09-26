import { combineReducers } from 'redux';
import { cleanWhenNoUser } from './utils';

export const appInfoReducer = combineReducers({
  refreshing: (state = false, action) => (action.type === 'SET_REFRESHING' ? action.refreshing : state),
  initializing: (state = false, action) => (action.type === 'SET_INITIALIZING' ? action.running : state),
  config: cleanWhenNoUser((state = {}, action) => (action.type === 'SET_CONFIG' ? action.config : state)),
});
