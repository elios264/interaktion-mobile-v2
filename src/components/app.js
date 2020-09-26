import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { AppLoading } from 'expo';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { HomeScreen } from './home.component';
import { DetailsScreen } from './details.component';

const { Navigator, Screen } = createNativeStackNavigator();

export const App = () => {
  const initializing = useSelector((state) => state.appInfo.initializing);

  if (initializing) {
    return <AppLoading />;
  }

  return (
    <>
      <StatusBar style='inverted' />
      <Navigator>
        <Screen name='Home' component={HomeScreen} />
        <Screen name='Details' component={DetailsScreen} />
      </Navigator>
    </>
  );
};
