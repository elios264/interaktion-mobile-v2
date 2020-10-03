import React from 'react';
import { Button, Layout } from '@ui-kitten/components';
import { Image } from 'react-native';
import { T } from '@shipt/react-native-tachyons';

import logo from 'assets/images/logo.png';

export const Home = ({ navigation }) => {

  const navigateDetails = () => {
    navigation.navigate('Details');
  };

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={logo} style={T('mv5 wp100 h8 rm-contain')} />
      <Button onPress={navigateDetails}>OPEN DETAILS</Button>
    </Layout>
  );
};
