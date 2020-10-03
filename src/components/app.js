import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { AppLoading } from 'expo';
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { T } from '@shipt/react-native-tachyons';

import logo from 'assets/images/logo.png';

import { authModes } from 'types';
import { Login } from './authentication';
import { Home } from './home';
import { Details } from './details';

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
    <Auth.Screen name='Login' component={Login} />
  </Auth.Navigator>
);
const MainStack = () => (
  <Main.Navigator screenOptions={mainScreenOptions}>
    <Main.Screen name='Home' component={Home} />
    <Main.Screen name='Details' component={Details} />
  </Main.Navigator>
);

export const App = () => {
  const initializing = useSelector((state) => state.appInfo.initializing);
  const { user, accessAsAnonymous } = useSelector((state) => state.userInfo);
  const { authMode } = useSelector((state) => state.appInfo.config);

  if (initializing) {
    return <AppLoading />;
  }

  const shouldPresentAuthStack = user.isAnonymous && (
    authMode === authModes.private
    || (authMode === authModes.mixed && !accessAsAnonymous)
  );

  return (
    <>
      <StatusBar style='inverted' />
      <Root.Navigator headerMode='none'>
        {shouldPresentAuthStack
          ? <Root.Screen name='auth' component={AuthStack} />
          : <Root.Screen name='main' component={MainStack} />}
      </Root.Navigator>
    </>
  );
};
