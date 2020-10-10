import PropTypes from 'prop-types';
import React from 'react';
import { Text, useTheme } from '@ui-kitten/components';
import { TouchableOpacity, Image } from 'react-native';
import { T } from '@shipt/react-native-tachyons';

const itemHeight = 300;

export const ContentElementFull = ({ content: { title, image } }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity style={T('ma4 ba bg-white', { height: itemHeight, borderColor: theme['color-primary-500'] })} activeOpacity={0.8}>
      <Image style={T('rm-cover wp100 flx-i', { maxHeight: itemHeight })} source={image} />
      <Text style={T('tc mv3')} category='h1' appearance='alternative'>{title}</Text>
    </TouchableOpacity>
  );
};

ContentElementFull.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.object.isRequired,
  }).isRequired,
};

ContentElementFull.itemHeight = itemHeight;
