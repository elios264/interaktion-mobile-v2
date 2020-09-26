import React from 'react';
import { SafeAreaView } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';


export const DetailsScreen = () => (
  <SafeAreaView style={{ flex: 1 }}>
    {/* <TopNavigation title='MyApp' alignment='center' accessoryLeft={BackAction}/>
      <Divider/> */}
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text category='h1'>DETAILS</Text>
    </Layout>
  </SafeAreaView>
);
