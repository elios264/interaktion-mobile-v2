import React from 'react';
import { T } from '@shipt/react-native-tachyons';
import { View } from 'react-native';
import { Button, Spinner } from '@ui-kitten/components';

export const LoadingButton = ({ loading, ...props }) => (
  <Button {...props} disabled={loading ? true : props.disabled} accessoryLeft={!loading ? props.accessoryLeft : ({ style }) => (
    <View style={T('jcc aic', style)}>
      <Spinner size='small' status='control' />
    </View>
  )} />
);
