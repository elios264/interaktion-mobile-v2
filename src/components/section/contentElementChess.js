import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@ui-kitten/components';
import { TouchableOpacity, Image, View } from 'react-native';
import { T } from '@shipt/react-native-tachyons';
import cx from 'classnames';

const itemHeight = 160;

export const ContentElementChess = ({ content: { title, image, description }, index }) => (
  <TouchableOpacity style={T(cx('mh4', index % 2 === 0 ? 'flx-row' : 'flx-row-reverse'), { height: itemHeight })} activeOpacity={0.8}>
    <Image style={T('rm-contain wp100 flx-i', { maxHeight: itemHeight })} source={image} />
    <View style={T('flx-i jcc')}>
      <View style={T('pa3')}>
        <Text style={T('tc')} category='h1' status='control'>{title}</Text>
        <Text style={T('tj')} category='p2' numberOfLines={6}>{description}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

ContentElementChess.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.object.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

ContentElementChess.itemHeight = itemHeight;
