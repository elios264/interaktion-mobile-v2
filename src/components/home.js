import PropTypes from 'prop-types';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import {
  Image, FlatList, Dimensions, TouchableOpacity, View,
} from 'react-native';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import { T } from '@shipt/react-native-tachyons';
import { useLinkProps } from '@react-navigation/native';

import { downloadInitialData } from 'actions/initializers';
import { useDispatchCallback } from 'controls/hooks';

const itemHeight = (Dimensions.get('window').height - 100) / 3.5;
const getItemLayout = (data, index) => ({ length: itemHeight, offset: itemHeight * index, index });
const getItemKey = _.iteratee('id');
const renderItem = ({ item }) => <SectionElement section={item} />;

export const Home = () => {
  const sections = useSelector((state) => state.objects.sections);
  const refreshing = useSelector((state) => state.appInfo.refreshing);

  const sortedSections = useMemo(() => _.sortBy(sections, 'order'), [sections]);
  const refreshData = useDispatchCallback(downloadInitialData);

  return (
    <Layout style={T('flx-i')}>
      <FlatList
        data={sortedSections}
        keyExtractor={getItemKey}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        onRefresh={refreshData}
        refreshing={refreshing}
      />
    </Layout>
  );
};

const SectionElement = ({ section: { id, title, image } }) => {

  const sectionLinkProps = useLinkProps({ to: queryString.stringifyUrl({ url: '/main/section', query: { sectionId: id } }) });

  return (
    <TouchableOpacity style={T('ba b--white', { height: itemHeight })} activeOpacity={0.8} {...sectionLinkProps}>
      <View style={T('absolute-fill')}>
        <Image style={T('flx-i asc o-70 wp100 rm-cover')} source={image} />
      </View>
      <View style={T('absolute-fill aic jcc pa3')}>
        <Text style={T('tc')} category='h1' status='control'>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

SectionElement.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.object.isRequired,
  }).isRequired,
};
