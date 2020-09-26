import i18n from 'i18n-js';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

import { fonts } from 'theme';
import { handleError } from './utils';


export const initialize = (store) => handleError(async (dispatch, getState, { api }) => {
  dispatch({ type: 'SET_INITIALIZING', running: true });

  try {

    await Promise.all([
      api.initialize(store),
      Font.loadAsync(fonts),
      Asset.loadAsync(require('assets/images/logo.png')),
    ]);

  } finally {
    dispatch({ type: 'SET_INITIALIZING', running: false });
  }
}, i18n.t('error.initialize'));
