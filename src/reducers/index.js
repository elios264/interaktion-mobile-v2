import { combineReducers } from 'redux';
import { createCRUDObjectReducer, cleanWhenNoUser } from './utils';
import { userInfoReducer } from './userInfo';
import { appInfoReducer } from './appInfo';

const objectsReducer = combineReducers({
  contents: createCRUDObjectReducer('Content'),
  sections: createCRUDObjectReducer('Section'),
});

export const rootReducer = combineReducers({
  appInfo: appInfoReducer,
  objects: cleanWhenNoUser(objectsReducer),
  userInfo: cleanWhenNoUser(userInfoReducer),
});
