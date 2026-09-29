import { HeaderHeightContext } from '@react-navigation/elements';
import Logo from '@src/presentation/ui/Logo';
import * as React from 'react';
import { useContext } from 'react';
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AuthContext } from '../../../../contexts/authContext';
import { LanguageContext } from '../../../../contexts/languageContext';
import { __ } from '../../../../localization/Localization';
import Styles from '../../../../styles/Styles';

export default function LoginScreen() {
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [loginFailed, setLoginFailed] = React.useState(false);
  const passwordRef = React.useRef(null);

  const inputStyle = {
    ...Styles.input,
    marginBottom: Styles.margins.medium,
  };

  const auth = useContext(AuthContext);
  useContext(LanguageContext);
  // Android no longer resizes the window for the keyboard with edge-to-edge (Expo SDK 54),
  // so move the form up ourselves. The offset accounts for the navigation header.
  const headerHeight = useContext(HeaderHeightContext) ?? 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}>
      <View style={Styles.container}>
        <Logo />

        <TextInput
          onChangeText={onChangeUsername}
          value={username}
          placeholder={__('Username')}
          placeholderTextColor={'gray'}
          keyboardType="email-address"
          textContentType="emailAddress"
          secureTextEntry={false}
          style={[inputStyle, loginFailed ? { ...Styles.inputWithError } : null]}
          enterKeyHint="next"
          returnKeyType="next"
          onFocus={() => {
            setLoginFailed(false);
          }}
          onSubmitEditing={() => passwordRef.current.focus()}
          blurOnSubmit={false}
        />

        <TextInput
          ref={passwordRef}
          onChangeText={onChangePassword}
          value={password}
          placeholderTextColor={'gray'}
          placeholder={__('Password')}
          keyboardType="default"
          secureTextEntry={true}
          style={[inputStyle, loginFailed ? { ...Styles.inputWithError } : null]}
          onFocus={() => {
            setLoginFailed(false);
          }}
        />

        <TouchableOpacity
          style={{
            ...Styles.button,
            ...Styles.button.green,
            width: '100%',
          }}
          onPress={() => {
            if (!username || !password) {
              setLoginFailed(true);
            } else {
              auth.login(username, password).catch(() => {
                setLoginFailed(true);
              });
            }
          }}>
          <Text style={Styles.button.text}>{__('Log in')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
