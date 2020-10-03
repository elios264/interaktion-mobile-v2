import React from 'react';
import { useDispatch } from 'react-redux';
import { Layout, Text } from '@ui-kitten/components';

import { logout } from 'actions/authentication';
import { AwaitableButton } from 'controls';

export const Details = () => {
  const dispatch = useDispatch();
  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text category='h1'>DETAILS</Text>
      <AwaitableButton style={{ marginTop: 20 }} onPress={() => dispatch(logout())}>Logout</AwaitableButton>
    </Layout>
  );
};
