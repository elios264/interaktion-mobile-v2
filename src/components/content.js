import React, { useLayoutEffect } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { T } from '@shipt/react-native-tachyons';
import i18n from 'i18n-js';

import { AutoHeightImage, RichTextRenderer, utils } from 'controls';
import { contentTypes } from 'types';

export const Content = ({ route, navigation }) => {
  const { id } = route.params;

  const content = useSelector((state) => state.objects.contents[id]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerBackTitle: i18n.t('back') });
  }, [navigation]);

  if (!content) {
    return null;
  }

  const {
    image, document, entityType, entityInfo,
  } = content;

  return (
    <Layout style={T('flx-i')}>
      <ScrollView>
        <AutoHeightImage style={T('wp100 rm-contain ba b--white')} source={image} />
        <View style={T('mv4')}>
          {entityType === contentTypes.event && (
            <View style={T('mb4')}>
              <Text selectable>
                <Text style={T('ff_2b')}>Location:</Text>
                {' '}
                {entityInfo.location}
              </Text>
              <Text selectable>
                <Text style={T('ff_2b')}>Start date:</Text>
                {' '}
                {utils.formatDate(entityInfo.start)}
              </Text>
            </View>
          )}
          <RichTextRenderer document={document} />
        </View>
      </ScrollView>
    </Layout>
  );
};
