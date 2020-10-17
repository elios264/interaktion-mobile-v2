import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useLayoutEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  Layout, Text, Button, Icon, Divider,
} from '@ui-kitten/components';
import { useSelector, useDispatch } from 'react-redux';
import { T } from '@shipt/react-native-tachyons';
import i18n from 'i18n-js';
import * as WebBrowser from 'expo-web-browser';
import { logout } from 'actions/authentication';

import { authModes } from 'types';

export const Settings = ({ navigation }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.userInfo.user);
  const { features: { authMode }, privacyPolicyUrl } = useSelector((state) => state.appInfo.config);

  useLayoutEffect(() => {
    navigation.setOptions({ title: i18n.t('settings') });
  }, [navigation]);

  return (
    <Layout style={T('flx-i pv4')}>
      <Text
        style={T('ff_2b ph5')}
        category='h1'
      >
        {i18n.t('settings.greeting', { name: user.isAnonymous ? i18n.t('settings.anonymous') : _.words(user.get('name'))[0] })}
      </Text>
      <View style={T('mt6 mb4 flx-i')}>
        {!user.isAnonymous && (
          <SettingElement
            left={i18n.t('settings.account')}
            right={<Icon name='arrow-ios-forward-outline' fill='white' style={T('white w5 h5')} />}
            onPress={() => navigation.navigate('profile')}
          />
        )}
        {privacyPolicyUrl && (
          <SettingElement
            left={i18n.t('settings.privacyPolicy')}
            onPress={() => WebBrowser.openBrowserAsync(privacyPolicyUrl)}
          />
        )}
      </View>
      {authMode !== authModes.public && (
        <View style={T('ph5 mb3')}>
          <Button appearance='outline' onPress={() => dispatch(logout())}>
            {i18n.t('settings.logout')}
          </Button>
        </View>
      )}
    </Layout>
  );
};

const SettingElement = ({
  left, right, style, ...props
}) => (
  <>
    <TouchableOpacity style={T('pa5 flx-row jcsb aic', style)} {...props}>
      <Text category='s2'>{left}</Text>
      {right}
    </TouchableOpacity>
    <Divider />
  </>
);
SettingElement.propTypes = {
  left: PropTypes.string.isRequired,
  right: PropTypes.node,
  style: PropTypes.object,
};

SettingElement.defaultProps = {
  right: undefined,
  style: undefined,
};
