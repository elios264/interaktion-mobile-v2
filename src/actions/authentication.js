import i18n from 'i18n-js';
import { handleError, showDialog } from './utils';
import { downloadInitialData } from './initializers';

export const accessAsAnonymous = () => ({ type: 'SET_ACCESS_AS_ANONYMOUS', accessAsAnonymous: true });

export const login = (loginData) => handleError(async (dispatch, getState, { api }) => {
  await api.login(loginData);
  dispatch(downloadInitialData());
  return true;
}, i18n.t('error.login'));

export const logout = () => handleError(async (dispatch, getState, { api }) => {
  api.logout();
  return true;
}, i18n.t('error.logout'));

export const signup = ({ name, email }) => handleError(async (dispatch, getState, { api }) => {
  await api.signup({ name, email });
  showDialog(i18n.t('success.signup'));
  return true;
}, i18n.t('error.signup'));

export const resetPassword = ({ email }) => handleError(async (dispatch, getState, { api }) => {
  await api.requestPasswordReset(email);
  showDialog(i18n.t('success.resetPassword'));
  return true;
}, i18n.t('error.resetPassword'));

export const updateProfile = (user) => handleError(async (dispatch, getState, { api }) => {
  await api.updateProfile(user);
  showDialog(i18n.t('success.updateProfile'));
  return true;
}, i18n.t('error.updateProfile'));
