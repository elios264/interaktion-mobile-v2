import PropTypes from 'prop-types';
import React from 'react';
import { T } from '@shipt/react-native-tachyons';
import { View } from 'react-native';
import { Button, Spinner } from '@ui-kitten/components';

export const LoadingButton = ({
  loading, disabled, accessoryLeft, ...props
}) => (
  <Button
    {...props}
    disabled={loading ? true : disabled}
    accessoryLeft={!loading ? accessoryLeft : ({ style }) => (
      <View style={T('jcc aic', style)}>
        <Spinner size='small' status='control' />
      </View>
    )}
  />
);

LoadingButton.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  accessoryLeft: PropTypes.func,
};
