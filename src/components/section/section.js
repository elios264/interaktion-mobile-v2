import PropTypes from 'prop-types';
import _ from 'lodash';
import React, {
  useMemo, useCallback, useLayoutEffect, useState, useRef,
} from 'react';
import {
  Layout, Text, Button, Icon,
} from '@ui-kitten/components';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { T } from '@shipt/react-native-tachyons';
import i18n from 'i18n-js';

import { downloadInitialData } from 'actions/initializers';
import { useDispatchCallback } from 'controls/hooks';
import { mobileViews } from 'types';

import { ContentHeader } from './contentHeader';
import { ContentElementList } from './contentElementList';
import { ContentElementFull } from './contentElementFull';
import { ContentElementChess } from './contentElementChess';

const itemViewer = {
  [mobileViews.list]: ContentElementList,
  [mobileViews.full]: ContentElementFull,
  [mobileViews.chess]: ContentElementChess,
};

const getItemKey = _.iteratee('id');
const normalizeStr = _.flow(_.trim, _.toLower, _.deburr);
const includesDeburr = (collection, value) => _.includes(normalizeStr(collection), normalizeStr(value));

export const Section = ({ route, navigation }) => {
  const { sectionId } = route.params;

  const listRef = useRef();
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const refreshing = useSelector((state) => state.appInfo.refreshing);
  const refreshData = useDispatchCallback(downloadInitialData);

  const section = useSelector((state) => state.objects.sections[sectionId]);
  const contents = useSelector((state) => state.objects.contents);
  const sortedContents = useMemo(() => _(contents)
    .filter(['section', sectionId])
    .filter(({ title }) => includesDeburr(title, search))
    .sortBy('title')
    .value(),
  [contents, sectionId, search]);

  const navigateToContent = useCallback(({ id }) => navigation.navigate('content', { contentId: id }), [navigation]);
  const toggleSearch = useCallback(() => {
    setSearching(!searching);
    setSearch('');
    if (!searching) listRef.current.scrollToOffset(0);
  }, [searching]);

  const contentComponent = useMemo(() => itemViewer[section.mobileView] || ContentElementList, [section.mobileView]);
  const getItemLayout = useCallback((data, index) => ({ length: contentComponent.itemHeight, offset: contentComponent.itemHeight * index, index }), [contentComponent]);
  const itemRenderer = useCallback(({ item, index }) => React.createElement(contentComponent, { content: item, index, onPress: navigateToContent }), [contentComponent, navigateToContent]);
  const headerRenderer = useCallback(() => (section ? <ContentHeader section={section} searching={searching} onSearchChange={setSearch} /> : null), [section, searching]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <SearchButton onToggleSearch={toggleSearch} searching={searching} />,
      title: section.title,
    });
  }, [toggleSearch, navigation, searching, section.title]);

  return (
    <Layout style={T('flx-i')}>
      <FlatList
        ref={listRef}
        data={sortedContents}
        ListHeaderComponent={headerRenderer}
        ListEmptyComponent={ContentEmpty}
        keyExtractor={getItemKey}
        getItemLayout={getItemLayout}
        renderItem={itemRenderer}
        onRefresh={refreshData}
        refreshing={refreshing}
      />
    </Layout>
  );
};

const ContentEmpty = () => (
  <Text appearance='hint' category='h6' style={T('tc mh4 mt5')}>
    {i18n.t('section.empty')}
  </Text>
);

const SearchButton = ({ searching, onToggleSearch }) => (
  <Button
    onPress={onToggleSearch}
    appearance='ghost'
    size={searching ? 'giant' : 'large'}
    status={searching ? 'primary' : 'basic'}
    accessoryLeft={searching ? undefined : (props) => <Icon name='search-outline' {...props} />}
  >
    {searching ? i18n.t('cancel') : ''}
  </Button>
);
SearchButton.propTypes = {
  searching: PropTypes.bool.isRequired,
  onToggleSearch: PropTypes.func.isRequired,
};
