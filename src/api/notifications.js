import _ from 'lodash';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import i18n from 'i18n-js';

export class NotificationsApi {

  constructor(api) {
    this.api = api;
    this.getStore = () => api.store;
  }

  onNotificationReceived = (handler) => {
    Notifications.addNotificationResponseReceivedListener(handler);
    Notifications.setNotificationHandler({
      handleNotification: () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

  }

  updateInstallation = async () => {
    if (!Constants.isDevice) {
      return false;
    }

    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted' || Platform.OS === 'android') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const installationData = {
      installationId: Constants.installationId,
      deviceName: Constants.deviceName,
      deviceYear: Constants.deviceYearClass,
      deviceVersion: _.toString(Platform.Version),
      devicePlatform: Platform.OS,
      appVersion: Constants.nativeAppVersion,
      buildVersion: _.toString(Constants.nativeBuildVersion),
      language: i18n.locale,
      enabled: true,
      pushToken: await Notifications.getExpoPushTokenAsync().then((token) => token.data),
    };

    await this.api.runCloudCode('set-installation', installationData);

    return true;
  };

}
