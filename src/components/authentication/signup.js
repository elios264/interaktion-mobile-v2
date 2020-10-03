import React, { useCallback } from 'react';
import { View, Image } from 'react-native';
import { T } from '@shipt/react-native-tachyons';
import i18n from 'i18n-js';
import Joi from 'joi';
import {
  Layout, Button, Input, Icon, Text,
} from '@ui-kitten/components';

import { KeyboardAvoidingView, LoadingButton } from 'controls';
import { useFieldset, useDispatchCallback, useAsyncSubmit } from 'controls/hooks';
import { signup } from 'actions/authentication';

import logo from 'assets/images/logo.png';

const signupTemplate = { name: '', email: '' };
const signupSchema = {
  name: Joi.string().trim().required().max(50).label(i18n.t('name')),
  email: Joi.string().lowercase().email({ tlds: { allow: false } }).max(50).required().label(i18n.t('email')),
};

export const Signup = ({ navigation }) => {
  const navigateToLogin = useCallback(() => navigation.navigate('login'), [navigation]);

  const { fields: { name, email }, submit, loading } = useFieldset({
    schema: signupSchema,
    source: signupTemplate,
    onSubmit: useAsyncSubmit(useDispatchCallback(signup), navigateToLogin),
  });

  return (
    <KeyboardAvoidingView>
      <Layout style={T('flx-i')}>
        <View style={T('jcc aic min-h9')}>
          <Image style={T('wp100 mv5 h8 rm-contain')} source={logo} />
          <Text category='s1' status='control'>
            {i18n.t('signup.signupAccount')}
          </Text>
        </View>
        <View style={T('flx-i ph5 pt6')}>
          <Input
            status={name.errored ? 'danger' : 'control'}
            placeholder={i18n.t('name')}
            accessoryRight={(props) => <Icon {...props} name='person' />}
            value={name.value}
            autoCapitalize='words'
            textContentType='name'
            onChangeText={name.onChange}
            caption={name.errored && name.message}
          />
          <Input
            style={T('mt5')}
            status={email.errored ? 'danger' : 'control'}
            placeholder={i18n.t('email')}
            accessoryRight={(props) => <Icon {...props} name='email' />}
            value={email.value}
            autoCapitalize='none'
            textContentType='emailAddress'
            keyboardType='email-address'
            onChangeText={email.onChange}
            caption={email.errored && email.message}
          />
        </View>
        <LoadingButton style={T('mh5')} size='large' onPress={submit} loading={loading}>
          {i18n.t('signup.signup')}
        </LoadingButton>
        <Button style={T('mv4 mh5')} appearance='ghost' status='control' onPress={navigateToLogin}>
          {i18n.t('signup.signIn')}
        </Button>
      </Layout>
    </KeyboardAvoidingView>
  );
};
