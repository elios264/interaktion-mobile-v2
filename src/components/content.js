import React from 'react';
import { Layout } from '@ui-kitten/components';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { T } from '@shipt/react-native-tachyons';

import { AutoHeightImage, RichTextRenderer } from 'controls';

export const Content = ({ route }) => {
  const { contentId } = route.params;

  const content = useSelector((state) => state.objects.contents[contentId]);

  if (!content) {
    return null;
  }

  const { image, document } = content;

  return (
    <Layout style={T('flx-i')}>
      <ScrollView>
        <AutoHeightImage style={T('wp100 rm-contain ba b--white')} source={image} />
        <View style={T('ma4')}>
          <RichTextRenderer document={document} />
        </View>
      </ScrollView>
    </Layout>
  );
};
