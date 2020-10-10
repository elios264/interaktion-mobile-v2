import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Text, useTheme } from '@ui-kitten/components';
import { TouchableOpacity, View } from 'react-native';
import { T } from '@shipt/react-native-tachyons';

import { AutoHeightImage } from 'controls';

const itemHeight = 170;

export const ContentElementList = ({ content: { title, image, description } }) => {
  const theme = useTheme();
  const thumbImage = useMemo(() => ({ ...image, uri: image.thumb }), [image]);

  return (
    <TouchableOpacity style={T('mh4', { height: itemHeight })} activeOpacity={0.8}>
      <View style={T('flx-row flx-i aic')}>
        <AutoHeightImage style={T('rm-contain w8', { maxHeight: itemHeight })} source={thumbImage} />
        <View style={T('flx-i ml3')}>
          <Text style={T('ff_1 mb1')} category='h4' status='control'>{title}</Text>
          <Text style={T('tj')} category='p1' numberOfLines={6}>{description}</Text>
        </View>
      </View>
      <View style={T('mh4 h1 mv4', { backgroundColor: theme['color-primary-500'] })} />
    </TouchableOpacity>
  );
};

ContentElementList.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.object.isRequired,
  }).isRequired,
};

ContentElementList.itemHeight = itemHeight;
