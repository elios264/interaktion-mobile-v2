import { combineReducers } from 'redux';

export const userInfoReducer = combineReducers({
  user: (state = null, action) => (action.type === 'SET_USER' ? (action.user || null) : state),
});
