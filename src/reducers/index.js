import { combineReducers } from 'redux';
import { createCRUDObjectReducer } from './utils';
import { userInfoReducer } from './userInfo';
import { appInfoReducer } from './appInfo';

const objectsReducer = combineReducers({
  contents: createCRUDObjectReducer('CONTENTS'),
  sections: createCRUDObjectReducer('SECTIONS'),
  pages: createCRUDObjectReducer('PAGES'),
});

export const rootReducer = combineReducers({
  appInfo: appInfoReducer,
  userInfo: userInfoReducer,
  objects: objectsReducer,
});
