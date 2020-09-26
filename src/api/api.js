import Parse from 'parse/react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-community/async-storage';


export class Api {

  constructor() {
    Parse.setAsyncStorage(AsyncStorage);
    Parse.initialize(Constants.manifest.extra.apiId);
    Parse.serverURL = Constants.manifest.extra.apiUrl;
    this.store = null;
  }

  async initialize(store) {
    this.store = store;

    let user = await Parse.User.currentAsync();
    try {
      user = await user.fetch();
    } catch (err) {
      user = null;
    }

    if (user) {
      this.store.dispatch({ type: 'SET_USER', user });
      Parse.Cloud.run('set-last-activity-now');
    }

    return user;
  }


}
