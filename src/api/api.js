import _ from 'lodash';
import i18n from 'i18n-js';
import Parse from 'parse/react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-community/async-storage';
import queryString from 'query-string';

Parse.Object.disableSingleInstance();
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
      this._updateLastActivity();
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
    this._updateLastActivity();
    return user;
  }

  async logout() {
    this.store.dispatch({ type: 'SET_USER', user: anonymousUser });

    const parseUser = await Parse.User.currentAsync();
    if (parseUser) {
      Parse.User.logOut();
    }
  }

  async updateProfile(userData) {
    const parseUser = await Parse.User.currentAsync();
    if (!parseUser) {
      return userData;
    }

    // eslint-disable-next-line no-underscore-dangle
    const userCopy = Parse.Object.fromJSON(parseUser._toFullJSON());
    _.each(userData, (value, key) => {
      userCopy.set(key, value);
    });

    await userCopy.save()
      .then(() => parseUser.fetch())
      .then(() => this._updateLastActivity());

    this.store.dispatch({ type: 'SET_USER', user: parseUser });
    return parseUser;
  }

  runCloudCode = (name, data) => {
    this._updateLastActivity();
    return Parse.Cloud.run(name, data);
  }

  resetPassword = async ({ token, username, password }) => {

    const response = await fetch(`${Constants.manifest.extra.apiUrl}/apps/${Constants.manifest.extra.apiId}/request_password_reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: queryString.stringify({ new_password: password, token, username }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    const { url, query: { error } } = queryString.parseUrl(response.url);

    if (error) {
      throw new Error(error);
    }

    return _.endsWith(url, 'reset-success');
  }

  signup = ({ name, email }) => Parse.Cloud.run('create-user', { name, email, language: i18n.locale }).then(({ success }) => success)

  requestPasswordReset = (email) => Parse.User.requestPasswordReset(email);

  _updateLastActivity = () => Parse.Cloud.run('set-last-activity-now', { language: i18n.locale });
}
