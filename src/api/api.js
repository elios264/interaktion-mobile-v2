import Parse from 'parse/react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-community/async-storage';

const anonymousUser = Object.freeze({ isAnonymous: true });

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
      user = anonymousUser;
    }

    if (user) {
      this.store.dispatch({ type: 'SET_USER', user });
      Parse.Cloud.run('set-last-activity-now');
    }

    return user;
  }

  async login({ email, password }) {
    const parseUser = await Parse.User.currentAsync();
    if (parseUser) {
      Parse.User.logOut();
    }

    const user = await Parse.User.logIn(email, password);
    this.store.dispatch({ type: 'SET_USER', user });
    return user;
  }

  async logout() {
    this.store.dispatch({ type: 'SET_USER', user: anonymousUser });

    const parseUser = await Parse.User.currentAsync();
    if (parseUser) {
      Parse.User.logOut();
    }
  }

  async updateProfile(user) {
    const parseUser = await Parse.User.currentAsync();
    if (!parseUser) {
      return user;
    }

    await user.save();
    this.store.dispatch({ type: 'SET_USER', user });
    return user;
  }

  runCloudCode = (name, data) => Parse.Cloud.run(name, data)

  signup = ({ name, email }) => Parse.Cloud.run('create-user', { name, email }).then(({ success }) => success)

  requestPasswordReset = (email) => Parse.User.requestPasswordReset(email);
}
