import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import { Image, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { T } from '@shipt/react-native-tachyons';
import { Icon, Button } from '@ui-kitten/components';
import i18n from 'i18n-js';

import logo from 'assets/images/logo.png';
import { logout } from 'actions/authentication';

import { authModes } from 'types';
import {
  Login, Signup, Reset, Forgot,
} from './authentication';
import { Home } from './home';
import { Section } from './section';

const Root = createStackNavigator();
const Auth = createStackNavigator();
const Main = createStackNavigator();

const LogoutComponent = () => {
  const dispatch = useDispatch();

  return (
    <Button
      appearance='ghost'
      size='large'
      status='basic'
      accessoryLeft={(props) => <Icon name='settings-outline' {...props} />}
      onPress={() => dispatch(logout())}
    />
  );

};

const mainScreenOptions = {
  headerStyle: T('bb', { height: 100 }),
  headerTitleAlign: 'center',
  headerTitle: () => <Image source={logo} style={T('w8 hp85 rm-contain')} />,
};
const homeOptions = {
  title: i18n.t('home'),
  headerRight: () => <LogoutComponent />,
};

const AuthStack = () => (
  <Auth.Navigator headerMode='none'>
    <Auth.Screen name='login' component={Login} />
    <Auth.Screen name='signup' component={Signup} />
    <Auth.Screen name='reset' component={Reset} />
    <Auth.Screen name='forgot' component={Forgot} />
  </Auth.Navigator>
);

const MainStack = () => (
  <Main.Navigator screenOptions={mainScreenOptions}>
    <Main.Screen name='home' component={Home} options={homeOptions} />
    <Main.Screen name='section' component={Section} />
  </Main.Navigator>
);

export const App = () => {
  const initializing = useSelector((state) => state.appInfo.initializing);
  const { user, accessAsAnonymous } = useSelector((state) => state.userInfo);
  const { authMode } = useSelector((state) => state.appInfo.config);

  if (initializing) {
    return null;
  }

  const shouldPresentAuthStack = user.isAnonymous && (
    authMode === authModes.private
    || (authMode === authModes.mixed && !accessAsAnonymous)
  );

  return (
    <>
      <StatusBar style={Platform.OS === 'android' ? 'auto' : 'inverted'} />
      <Root.Navigator headerMode='none'>
        {shouldPresentAuthStack
          ? <Root.Screen name='auth' component={AuthStack} />
          : <Root.Screen name='main' component={MainStack} />}
      </Root.Navigator>
    </>
  );
};
