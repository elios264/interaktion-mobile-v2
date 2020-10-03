import { combineReducers } from 'redux';
import { authModes } from 'types';

export const appInfoReducer = combineReducers({
  refreshing: (state = false, action) => (action.type === 'SET_REFRESHING' ? action.refreshing : state),
  initializing: (state = false, action) => (action.type === 'SET_INITIALIZING' ? action.running : state),
  config: (state = { authMode: authModes.private }, action) => (action.type === 'SET_CONFIG' ? action.config : state),
});
