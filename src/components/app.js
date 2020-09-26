import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppNavigator } from './navigation.component';

import theme from '../theme/custom-theme.json';
import mapping from '../theme/mapping.json';

export default function App() {

  const [fontsLoaded] = useFonts({
    osl: require('../../assets/fonts/Oswald.ttf'),
    osl_b: require('../../assets/fonts/Oswald_bold.ttf'),
    osl_bi: require('../../assets/fonts/Oswald_bold_italic.ttf'),
    al: require('../../assets/fonts/AbrahamLincoln.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View>
      <StatusBar style='inverted' />
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }} customMapping={mapping}>
        <AppNavigator />
      </ApplicationProvider>
    </View>
  );
}
