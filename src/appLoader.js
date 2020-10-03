import _ from 'lodash';
import { TextDecoder, TextEncoder } from 'text-encoding';
import React from 'react';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { build } from '@shipt/react-native-tachyons';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import * as theme from 'theme';
import translations from 'translations';

// polyfills
global.TextDecoder = global.TextDecoder || TextDecoder;
global.TextEncoder = global.TextEncoder || TextEncoder;

// pre import initialization
SplashScreen.preventAutoHideAsync();
build({ rem: theme.rem, styles: theme.styles });
i18n.defaultSeparator = '|';
i18n.defaultLocale = Constants.manifest.extra.defaultLocale;
i18n.locale = _(Localization.locale).split('-').head();
i18n.translations = translations;

// require needed modules for bootstrap
const { Api } = require('api');
const { rootReducer } = require('reducers');
const { initialize } = require('actions/initializers');
const { App } = require('components/app');

// bootstrap app
const linking = { prefixes: [Linking.makeUrl('/')] };
const nav = React.createRef();
const api = new Api();
const composeEnhancers = __DEV__ ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose; // eslint-disable-line no-undef
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk.withExtraArgument({ api, nav }))));
store.dispatch(initialize(store));

const Bootstrapper = () => (
  <Provider store={store}>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme.colors }} customMapping={theme.mapping}>
      <NavigationContainer linking={linking} ref={nav} theme={theme.navigation}>
        <App />
      </NavigationContainer>
    </ApplicationProvider>
  </Provider>
);

registerRootComponent(Bootstrapper);
