import i18n from 'i18n-js';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

import { fonts } from 'theme';
import { handleError } from './utils';

export const initialize = (store) => handleError(async (dispatch, getState, { api }) => {
  dispatch({ type: 'SET_INITIALIZING', running: true });

  try {

    await Promise.all([
      api.initialize(store).then(() => dispatch(downloadInitialData())),
      Font.loadAsync(fonts),
      Asset.loadAsync(require('assets/images/logo.png')),
    ]);

  } finally {
    dispatch({ type: 'SET_INITIALIZING', running: false });
    SplashScreen.hideAsync();
  }
}, i18n.t('error.initialize'));

export const downloadInitialData = () => handleError(async (dispatch, getState, { api }) => {

  dispatch({ type: 'SET_REFRESHING', refreshing: true });

  try {

    const { features, sections = [], contents = [] } = await api.runCloudCode('get-client-data', {
      language: i18n.locale,
    });

    dispatch({ type: 'SET_CONFIG', config: features });
    dispatch({ type: 'CONTENTS_FETCHED', objects: contents });
    dispatch({ type: 'SECTIONS_FETCHED', objects: sections });

  } finally {
    dispatch({ type: 'SET_REFRESHING', refreshing: false });
  }

}, i18n.t('error.initialData'));
