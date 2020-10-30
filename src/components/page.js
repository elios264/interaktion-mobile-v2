import React, { useLayoutEffect } from 'react';
import { Layout } from '@ui-kitten/components';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { T } from '@shipt/react-native-tachyons';
import i18n from 'i18n-js';

import { RichTextRenderer } from 'controls';

export const Page = ({ route, navigation }) => {
  const { id } = route.params;

  const page = useSelector((state) => state.objects.pages[id]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerBackTitle: i18n.t('back') });
  }, [navigation]);

  if (!page) {
    return null;
  }

  const { document } = page;

  return (
    <Layout style={T('flx-i')}>
      <ScrollView>
        <View style={T('mv4 mh5')}>
          <RichTextRenderer document={document} />
        </View>
      </ScrollView>
    </Layout>
  );
};
