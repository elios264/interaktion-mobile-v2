import _ from 'lodash';
import i18n from 'i18n-js';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import moment from 'moment';

import { fonts } from 'theme';
import { authModes } from 'types';
import { handleError } from './utils';
import { accessAsAnonymous } from './authentication'; // eslint-disable-line import/no-cycle

export const initialize = (store) => handleError(async (dispatch, getState, { api }) => {
  dispatch({ type: 'SET_INITIALIZING', running: true });

  try {

    await Promise.all([
      Font.loadAsync(fonts),
      Asset.loadAsync(require('assets/images/logo.png')),
      api.initialize(store).then(async () => {
        await dispatch(synchronizeData());
        api.notifications.onNotificationReceived(_.flow(routeNotification, dispatch));
      }),
    ]);

  } finally {
    dispatch({ type: 'SET_INITIALIZING', running: false });
    SplashScreen.hideAsync();
  }
}, i18n.t('error.initialize'));

export const synchronizeData = () => handleError(async (dispatch, getState, { api }) => {

  dispatch({ type: 'SET_REFRESHING', refreshing: true });

  try {

    const { config, sections = [], contents = [] } = await api.runCloudCode('get-client-data', {
      language: i18n.locale,
    });

    dispatch({ type: 'SET_CONFIG', config });
    dispatch({ type: 'CONTENTS_FETCHED', objects: contents });
    dispatch({ type: 'SECTIONS_FETCHED', objects: sections });

    // only await for essential data, the rest can be done in background
    api.notifications.updateInstallation();

  } finally {
    dispatch({ type: 'SET_REFRESHING', refreshing: false });
  }

}, i18n.t('error.initialData'));

export const routeNotification = ({ notification }) => handleError(async (dispatch, getState, { nav }) => {
  const action = _.get(notification, 'request.content.data.action');
  const contentId = _.get(notification, 'request.content.data.contentId');
  const contentUpdatedAt = _.get(notification, 'request.content.data.contentUpdatedAt');

  if (action !== 'view_content' || !contentId) {
    return false;
  }

  // lets check if we have the latest content, and refresh if we don't
  const cachedContent = getState().objects.contents[contentId];
  if (!cachedContent || !moment(cachedContent.updatedAt).isSame(contentUpdatedAt)) {
    await dispatch(synchronizeData());
  }

  // abort if no content
  const content = getState().objects.contents[contentId];
  if (!content) {
    return false;
  }

  // check if I have privilegies
  const { user, anonymousAccess } = getState().userInfo;
  const { authMode } = getState().appInfo.config.features;
  if (user.isAnonymous && authMode === authModes.private) {
    return false;
  }
  if (user.isAnonymous && !anonymousAccess && authMode === authModes.mixed) {
    dispatch(accessAsAnonymous());
  }

  // route to content
  nav.current.navigate('content', { contentId });

  return true;
}, i18n.t('error.openNotification'));
