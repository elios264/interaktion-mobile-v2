import _ from 'lodash';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import * as Linking from 'expo-linking';
import {
  Text, useTheme, Icon,
} from '@ui-kitten/components';
import { View, Text as RNText, TouchableOpacity } from 'react-native';
import { T } from '@shipt/react-native-tachyons';
import cx from 'classnames';

import { AutoHeightImage } from './autoHeightImage';

export const RichTextRenderer = ({ document }) => {
  const theme = useTheme();

  const renderLeaf = useCallback(({
    type, children, text,
    bold, italic,
    url,
  }, index) => {

    const isLink = type === 'a';

    const style = T(cx({
      ff_2b: bold,
      ff_2bi: bold && italic,
      ff_2: !bold && !italic,
      [theme['color-info-600']]: isLink,
    }));

    return (
      <RNText
        key={index}
        onPress={isLink ? () => Linking.openURL(url) : undefined}
        style={style}
      >
        {children ? _.map(children, renderLeaf) : (text || '\uFEFF')}
      </RNText>
    );

  }, [theme]);

  const renderElement = useCallback(({
    type, children, resource, url,
  }, { index, align }) => {

    const alignStyle = cx({
      tl: align === 'align_left',
      tc: align === 'align_center',
      tr: align === 'align_right',
      tj: align === 'align_justify',
    });

    switch (type) {
      case 'align_center':
      case 'align_left':
      case 'align_right':
      case 'align_justify':
        return _.map(children, (node, i) => renderElement(node, { index: i, align: type }));
      case 'blockquote':
        return (
          <View
            key={index}
            style={T('bl mh6 pl4', { borderColor: theme['color-basic-700'] })}
          >
            <Text
              selectable
              appearance='hint'
              category='h6'
              style={T(alignStyle)}
            >
              {_.map(children, renderLeaf)}
            </Text>
          </View>
        );
      case 'media_embed':
        return (
          <WebView
            key={index}
            style={T('wp100 h9 mv5')}
            allowsFullscreenVideo
            allowsInlineMediaPlayback={false}
            mediaPlaybackRequiresUserAction={false}
            domStorageEnabled
            source={{ uri: url }}
          />
        );
      case 'attachment':
        return (
          <TouchableOpacity key={index} style={T('flx-row br2 mv4 ba b--white')} onPress={() => Linking.openURL(resource.uri)}>
            <Icon style={T('w7 h7')} name='file-outline' fill='white' />
            <View style={T('flx-i jcc')}>
              <Text category='h6'>{resource.name}</Text>
              <Text category='s1'>
                {_.round(resource.size / (1024))}
                {' '}
                Kb
              </Text>
            </View>
          </TouchableOpacity>
        );
      case 'img':
        return <AutoHeightImage key={index} style={T('wp100 rm-contain')} source={resource} />;
      case 'divider':
        return <View key={index} style={T('h1 mv4', { backgroundColor: theme['color-primary-500'] })} />;
      case 'ul':
        return _.map(children, (node, i) => renderElement(node, { index: i, align }));
      case 'li':
        return (
          <View
            key={index}
            style={T('flx-row aic mh3')}
          >
            <Text style={T('asfs')} category='h1'>{'\u2022'}</Text>
            <View style={T('flx-i')}>
              {_.map(children, (node, i) => renderElement(node, { index: i, align }))}
            </View>
          </View>
        );
      case 'p':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return (
          <Text
            key={index}
            selectable
            appearance={_.get(children, '[0].underline') ? 'alternative' : 'default'}
            status={type === 'h6' ? 'control' : undefined}
            category={type === 'p' ? 'p1' : type}
            style={T(cx('ph4', alignStyle, { 'bg-white pv4': _.get(children, '[0].underline') }))}
          >
            {_.map(children, renderLeaf)}
          </Text>
        );
      default:
        return null;
    }

  }, [renderLeaf, theme]);

  return (
    _.map(document.children, (node, index) => renderElement(node, { index }))
  );
};

RichTextRenderer.propTypes = {
  document: PropTypes.object.isRequired,
};
