import { StatusBar } from 'expo-status-bar';
import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Button, IconRegistry, Icon } from '@ui-kitten/components';
import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';
import { EvaIconsPack } from '@ui-kitten/eva-icons';


import { default as theme } from './custom-theme.json';
import { default as mapping } from './mapping.json';

const FacebookIcon = (props) => (
  <Icon name='facebook' {...props} />
);

export default function App() {

  const [fontsLoaded] = useFonts({
    'osl': require('./assets/fonts/Oswald.ttf'),
    'osl_b': require('./assets/fonts/Oswald_bold.ttf'),
    'osl_bi': require('./assets/fonts/Oswald_bold_italic.ttf'),
    'al': require('./assets/fonts/AbrahamLincoln.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }} customMapping={mapping} >
        <StatusBar style='inverted' />
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
          <Text category='h1'>HOME</Text>
          <Button accessoryLeft={FacebookIcon}>Login with Facebook</Button>
        </Layout>
      </ApplicationProvider>
    </>
  );
}