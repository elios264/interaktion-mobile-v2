import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { Image, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { T } from '@shipt/react-native-tachyons';

import logo from 'assets/images/logo.png';
import { authModes } from 'types';
import {
  Login, Signup, Reset, Forgot,
} from './authentication';
import { Home } from './home';
import { Section } from './section';
import { Content } from './content';
import { Settings } from './settings';
import { Profile } from './profile';

const Root = createStackNavigator();
const Auth = createStackNavigator();
const Main = createStackNavigator();

const mainScreenOptions = {
  headerStyle: T('bb', { height: 100 }),
  headerTitleAlign: 'center',
  headerTitle: () => <Image source={logo} style={T('w8 hp85 rm-contain')} />,
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
    <Main.Screen name='home' component={Home} />
    <Main.Screen name='section' component={Section} />
    <Main.Screen name='content' component={Content} />
    <Main.Screen name='settings' component={Settings} />
    <Main.Screen name='profile' component={Profile} />
  </Main.Navigator>
);

export const App = () => {
  const initializing = useSelector((state) => state.appInfo.initializing);
  const { user, accessAsAnonymous } = useSelector((state) => state.userInfo);
  const { authMode } = useSelector((state) => state.appInfo.config.features);

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
