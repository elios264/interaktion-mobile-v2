import React, { useState, useCallback } from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import { useLinkProps } from '@react-navigation/native';
import { T } from '@shipt/react-native-tachyons';
import { useSelector } from 'react-redux';
import i18n from 'i18n-js';
import Joi from 'joi';
import {
  Layout, Button, Input, Text, Icon,
} from '@ui-kitten/components';

import { authModes } from 'types';
import { KeyboardAvoidingView, LoadingButton } from 'controls';
import { useFieldset, useDispatchCallback } from 'controls/hooks';
import { login, accessAsAnonymous } from 'actions/authentication';

import logo from 'assets/images/logo.png';

const loginTemplate = { email: '', password: '' };
const loginSchema = {
  email: Joi.string().lowercase().email({ tlds: { allow: false } }).max(50).required().label(i18n.t('email')),
  password: Joi.string().required().label(i18n.t('password')).max(30),
};

export const Login = () => {
  const signUpLinkProps = useLinkProps({ to: '/auth/signup' });

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { authMode } = useSelector((state) => state.appInfo.config);

  const accessAnonymously = useDispatchCallback(accessAsAnonymous);
  const { fields: { email, password }, submit, loading } = useFieldset({
    schema: loginSchema,
    source: loginTemplate,
    onSubmit: useDispatchCallback(login),
  });

  const renderSecureEntryIcon = useCallback((props) => (
    <TouchableWithoutFeedback onPress={() => setSecureTextEntry(!secureTextEntry)}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  ), [secureTextEntry]);

  return (
    <KeyboardAvoidingView>
      <Layout style={T('flx-i')}>
        <View style={T('jcc aic min-h9')}>
          <Image style={T('wp100 mv5 h8 rm-contain')} source={logo} />
          <Text category='s1' status='control'>
            {i18n.t('login.signInAccount')}
          </Text>
        </View>
        <View style={T('flx-i ph5')}>
          <Input
            status={email.errored ? 'danger' : 'control'}
            placeholder={i18n.t('email')}
            accessoryRight={(props) => <Icon {...props} name='person' />}
            value={email.value}
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            onChangeText={email.onChange}
            caption={email.errored && email.message}
          />
          <Input
            style={T('mt5')}
            status={password.errored ? 'danger' : 'control'}
            placeholder={i18n.t('password')}
            textContentType='password'
            accessoryRight={renderSecureEntryIcon}
            secureTextEntry={secureTextEntry}
            value={password.value}
            onChangeText={password.onChange}
            caption={password.errored && password.message}
          />
          <View style={T('flx-row jcfe')}>
            <Button style={T('ph0')} appearance='ghost' status='control'>
              {i18n.t('login.forgotPassword')}
            </Button>
          </View>
        </View>
        <LoadingButton style={T('mh5')} size='large' onPress={submit} loading={loading}>
          {i18n.t('login.signIn')}
        </LoadingButton>
        {authMode === authModes.mixed && (
          <View>
            <Text style={T('asc mv5')} status='control'>
              {i18n.t('login.or')}
            </Text>
            <Button style={T('mh5')} appearance='outline' status='primary' size='large' onPress={accessAnonymously} loading={loading}>
              {i18n.t('login.accessAnonymously')}
            </Button>
          </View>
        )}
        <Button style={T('mv4')} appearance='ghost' status='control' {...signUpLinkProps}>
          {i18n.t('login.signUp')}
        </Button>
      </Layout>
    </KeyboardAvoidingView>
  );
};
