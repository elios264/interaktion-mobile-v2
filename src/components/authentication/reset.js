import React, { useCallback, useState } from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import { T } from '@shipt/react-native-tachyons';
import i18n from 'i18n-js';
import Joi from 'joi';
import {
  Layout, Button, Input, Icon, Text,
} from '@ui-kitten/components';

import { KeyboardAvoidingView, LoadingButton } from 'controls';
import { useFieldset, useDispatchCallback, useAsyncSubmit } from 'controls/hooks';
import { resetPassword } from 'actions/authentication';

import logo from 'assets/images/logo.png';

const resetPasswordTemplate = { password: '' };
const resetPasswordSchema = {
  password: Joi.string().label(i18n.t('password')).ruleset.pattern(/^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/).max(30).message(i18n.t('reset.passwordRequirements')),
};

export const Reset = ({ navigation, route }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const navigateToLogin = useCallback(() => navigation.reset({ index: 0, routes: [{ name: 'login' }] }), [navigation]);

  const { fields: { password }, submit, loading } = useFieldset({
    schema: resetPasswordSchema,
    source: resetPasswordTemplate,
    onSubmit: useAsyncSubmit(useDispatchCallback(resetPassword, route.params), navigateToLogin),
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
            {i18n.t('reset.resetPassword')}
          </Text>
        </View>
        <View style={T('ph6 pt6 pb5')}>
          <Input
            style={T('br6')}
            status={password.errored ? 'danger' : 'control'}
            placeholder={i18n.t('password')}
            value={password.value}
            autoCapitalize='none'
            textContentType='newPassword'
            onChangeText={password.onChange}
            caption={password.errored && password.message}
            accessoryLeft={renderSecureEntryIcon}
            secureTextEntry={secureTextEntry}
          />
        </View>
        <LoadingButton style={T('mh7 br6')} size='large' onPress={submit} loading={loading}>
          {i18n.t('submit')}
        </LoadingButton>
        <Button style={T('mv4 mh5')} appearance='ghost' status='control' onPress={navigateToLogin}>
          {i18n.t('reset.backToSignIn')}
        </Button>
      </Layout>
    </KeyboardAvoidingView>
  );
};
