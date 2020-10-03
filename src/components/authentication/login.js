import React from 'react';
import { Layout, Button } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';

export const Login = () => {
  const dispatch = useDispatch();
  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button onPress={() => dispatch({ type: 'SET_ACCESS_AS_ANONYMOUS', accessAsAnonymous: true })}>LOGIN</Button>
    </Layout>
  );
};
