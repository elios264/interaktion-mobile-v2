import { combineReducers } from 'redux';
import { createCRUDObjectReducer, cleanWhenNoUser } from './utils';
import { userInfoReducer } from './userInfo';
import { appInfoReducer } from './appInfo';

const objectsReducer = combineReducers({
  contents: createCRUDObjectReducer('CONTENTS'),
  sections: createCRUDObjectReducer('SECTIONS'),
});

export const rootReducer = combineReducers({
  appInfo: appInfoReducer,
  userInfo: userInfoReducer,
  objects: cleanWhenNoUser(objectsReducer),
});
