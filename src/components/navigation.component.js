import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { HomeScreen } from './home.component';
import { DetailsScreen } from './details.component';

enableScreens();

const { Navigator, Screen } = createNativeStackNavigator();

const HomeNavigator = () => (
  <Navigator>
    <Screen name='Home' component={HomeScreen} />
    <Screen name='Details' component={DetailsScreen} />
  </Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer theme={DarkTheme}>
    <HomeNavigator />
  </NavigationContainer>
);
