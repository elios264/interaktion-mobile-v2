import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Text, useTheme, Input, Icon,
} from '@ui-kitten/components';
import { View } from 'react-native';
import { T } from '@shipt/react-native-tachyons';

import { AutoHeightImage } from 'controls';

export const ContentHeader = ({ section: { title, image }, searching, onSearchChange }) => {
  const theme = useTheme();
  return (
    <View>
      {searching && <Input status='control' style={T('ma2 br5')} placeholder='Search here' onChangeText={onSearchChange} accessoryRight={(props) => <Icon {...props} name='search-outline' />} autoFocus />}
      <AutoHeightImage style={T('wp100 rm-contain ba b--white')} source={image} />
      <Text style={T('tc f6 pv5 ph3')} category='h1' status='primary'>{title}</Text>
      <View style={T('mh3 h2 mb5', { backgroundColor: theme['color-primary-500'] })} />
    </View>
  );
};

ContentHeader.propTypes = {
  onSearchChange: PropTypes.func,
  searching: PropTypes.bool,
  section: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.object.isRequired,
  }).isRequired,
};

ContentHeader.defaultProps = {
  searching: false,
  onSearchChange: _.noop,
};
