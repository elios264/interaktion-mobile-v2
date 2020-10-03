import { Alert } from 'react-native';
import i18n from 'i18n-js';

export const showDialog = (title, message = '', buttons, options) => {
  setTimeout(() => {
    Alert.alert(title, message, buttons,
      { cancelable: true, ...options });
  }, 200);
};
export const showConfirmDialog = (title, message) => new Promise((res) => {
  Alert.alert(title, message, [
    { text: i18n.t('cancel'), onPress: () => res(false), style: 'cancel' },
    { text: i18n.t('continue'), onPress: () => res(true) },
  ], { cancelable: false });
});

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
