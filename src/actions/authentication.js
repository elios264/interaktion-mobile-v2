import i18n from 'i18n-js';
import { handleError, showDialog } from './utils';
import { synchronizeData } from './initializers'; // eslint-disable-line import/no-cycle

export const accessAsAnonymous = () => ({ type: 'SET_ACCESS_AS_ANONYMOUS', accessAsAnonymous: true });

export const login = (loginData) => handleError(async (dispatch, getState, { api }) => {
  await api.login(loginData);
  dispatch(synchronizeData());
  return true;
}, i18n.t('error.login'));

export const logout = () => handleError(async (dispatch, getState, { api }) => {
  api.logout().then(() => api.notifications.updateInstallation());
  return true;
}, i18n.t('error.logout'));

export const signup = ({ name, email }) => handleError(async (dispatch, getState, { api }) => {
  await api.signup({ name, email });
  showDialog(i18n.t('success.signup'));
  return true;
}, i18n.t('error.signup'));

export const requestPasswordReset = ({ email }) => handleError(async (dispatch, getState, { api }) => {
  await api.requestPasswordReset(email);
  showDialog(i18n.t('success.requestPasswordReset'));
  return true;
}, i18n.t('error.requestPasswordReset'));

export const resetPassword = ({ token, username }, { password }) => handleError(async (dispatch, getState, { api }) => {
  await api.resetPassword({ token, username, password });
  showDialog(i18n.t('success.resetPassword'));
  return true;
}, i18n.t('error.resetPassword'));

export const updateProfile = (userData) => handleError(async (dispatch, getState, { api }) => {
  await api.updateProfile(userData);
  showDialog(i18n.t('success.updateProfile'));
  return true;
}, i18n.t('error.updateProfile'));
