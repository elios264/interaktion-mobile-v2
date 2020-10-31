import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { T } from '@shipt/react-native-tachyons';
import { View, TouchableOpacity } from 'react-native';
import { Spinner, useTheme, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';

const Button = ({ // eslint-disable-next-line react/prop-types
  style, children, accessoryLeft, disabled, size, ...props
}) => {
  const theme = useTheme();

  const gradientColors = useMemo(() => [
    theme['color-primary-800'],
    theme['color-primary-400'],
  ], [theme]);

  const gradientColorsDisabled = useMemo(() => [
    theme['color-basic-800'],
    theme['color-basic-500'],
  ], [theme]);

  return (
    <TouchableOpacity {...props} disabled={disabled} activeOpacity={0.6}>
      <LinearGradient colors={disabled ? gradientColorsDisabled : gradientColors} style={T('flx-i aic jcc pa4 pt5', style)}>
        {(accessoryLeft && accessoryLeft({})) || (
          <Text style={T('tc ff_1 black')} status='control' category='h5'>
            {_.toUpper(children)}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

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
