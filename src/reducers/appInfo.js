import { combineReducers } from 'redux';
import { authMode } from 'types';

export const appInfoReducer = combineReducers({
  refreshing: (state = false, action) => (action.type === 'SET_REFRESHING' ? action.refreshing : state),
  initializing: (state = false, action) => (action.type === 'SET_INITIALIZING' ? action.running : state),
  config: (state = { authMode: authMode.private }, action) => (action.type === 'SET_CONFIG' ? action.config : state),
});
