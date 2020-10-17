import _ from 'lodash';
import { combineReducers } from 'redux';
import { authModes } from 'types';

const defaultConfig = {
  features: { authMode: authModes.private },
};

export const appInfoReducer = combineReducers({
  refreshing: (state = false, action) => (action.type === 'SET_REFRESHING' ? action.refreshing : state),
  initializing: (state = false, action) => (action.type === 'SET_INITIALIZING' ? action.running : state),
  config: (state = defaultConfig, action) => (action.type === 'SET_CONFIG' ? _.defaultsDeep({}, action.config, defaultConfig) : state),
});
