import React, { useMemo } from 'react';
import { View } from 'react-native';
import Joi from 'joi';
import {
  Layout, Text, Input, Icon,
} from '@ui-kitten/components';
import { useSelector } from 'react-redux';
import { T } from '@shipt/react-native-tachyons';
import i18n from 'i18n-js';

import { updateProfile } from 'actions/authentication';
import { useFieldset, useDispatchCallback } from 'controls/hooks';
import { KeyboardAvoidingView, LoadingButton } from 'controls';

const profileSchema = {
  name: Joi.string().trim().required().max(50).label(i18n.t('name')),
  email: Joi.string().lowercase().email({ tlds: { allow: false } }).max(50).required().label(i18n.t('email')),
};

export const Profile = () => {
  const user = useSelector((state) => state.userInfo.user);

  const { fields: { name, email }, submit, loading } = useFieldset({
    schema: profileSchema,
    source: useMemo(() => ({ name: user.get('name'), email: user.get('email') }), [user]),
    onSubmit: useDispatchCallback(updateProfile),
  });

  return (
    <KeyboardAvoidingView>
      <Layout style={T('flx-i pv4')}>
        <Text
          style={T('ff_2b ph5')}
          category='h1'
        >
          {i18n.t('profile.title')}
        </Text>
        <View style={T('mt6 mb5 ph6')}>
          <Input
            style={T('br6')}
            status={name.errored ? 'danger' : 'control'}
            placeholder={i18n.t('name')}
            accessoryLeft={(props) => <Icon {...props} name='person' />}
            value={name.value}
            autoCapitalize='words'
            textContentType='name'
            onChangeText={name.onChange}
            caption={name.errored && name.message}
          />
          <Input
            style={T('mt5 br6')}
            status={email.errored ? 'danger' : 'control'}
            placeholder={i18n.t('email')}
            accessoryLeft={(props) => <Icon {...props} name='email' />}
            value={email.value}
            autoCapitalize='none'
            textContentType='emailAddress'
            keyboardType='email-address'
            onChangeText={email.onChange}
            caption={email.errored && email.message}
          />
        </View>
        <View style={T('ph5 mb3')}>
          <LoadingButton style={T('mh7 br6')} onPress={submit} loading={loading} size='large'>
            {i18n.t('update')}
          </LoadingButton>
        </View>
      </Layout>
    </KeyboardAvoidingView>
  );
};
