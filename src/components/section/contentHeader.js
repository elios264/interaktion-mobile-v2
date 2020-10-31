import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import {
  Text, useTheme, Input, Icon,
} from '@ui-kitten/components';
import MaskedView from '@react-native-community/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { T } from '@shipt/react-native-tachyons';
import i18n from 'i18n-js';

import { AutoHeightImage } from 'controls';

export const ContentHeader = ({ section: { title, image }, searching, onSearchChange }) => {
  const theme = useTheme();

  const gradientColors = useMemo(() => [
    theme['color-primary-700'],
    theme['color-primary-200'],
    theme['color-primary-700'],
  ], [theme]);

  return (
    <View>
      {searching && <Input status='control' style={T('ma2 br6', { borderColor: 'transparent', backgroundColor: theme['color-basic-900'] })} placeholder={i18n.t('section.search')} onChangeText={onSearchChange} accessoryLeft={(props) => <Icon {...props} name='search-outline' />} autoFocus />}
      <AutoHeightImage style={T('wp100 rm-contain ba b--white')} source={image} />
      <MaskedView style={T('mt5 mb3')} maskElement={<Text style={T('tc ph3', { fontSize: 60 })} category='h1' status='primary'>{title}</Text>}>
        <LinearGradient colors={gradientColors}>
          <Text style={T('tc ph3 o-0', { fontSize: 60 })} category='h1' status='primary'>{title}</Text>
        </LinearGradient>
      </MaskedView>
      <MaskedView style={T('mb5 mh3')} maskElement={<View style={T('h2', { backgroundColor: theme['color-primary-500'] })} />}>
        <LinearGradient colors={gradientColors} style={T('h2')} />
      </MaskedView>
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
