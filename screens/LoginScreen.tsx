import * as React from 'react';
import { useContext } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import Logo from '../components/Logo';
import { AuthContext } from '../contexts/authContext';
import { LanguageContext } from '../contexts/languageContext';
import { __ } from '../localization/Localization';
import Styles from '../styles/Styles';

export default function LoginScreen() {
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [loginFailed, setLoginFailed] = React.useState(false);

  const inputStyle = {
    ...Styles.input,
    marginBottom: Styles.margins.medium,
  };

  const auth = useContext(AuthContext);
  useContext(LanguageContext);

  return (
    <View style={Styles.container}>
      <Logo />

      <TextInput
        onChangeText={onChangeUsername}
        value={username}
        placeholder={__('Username')}
        keyboardType="email-address"
        textContentType="emailAddress"
        style={[inputStyle, loginFailed ? { ...Styles.inputWithError } : null]}
      />

      <TextInput
        onChangeText={onChangePassword}
        value={password}
        placeholder={__('Password')}
        keyboardType="default"
        secureTextEntry={true}
        style={[inputStyle, loginFailed ? { ...Styles.inputWithError } : null]}
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
            auth.login(username, password).catch((error) => {
              setLoginFailed(true);
            });
          }
        }}>
        <Text style={Styles.button.text}>{__('Log in')}</Text>
      </TouchableOpacity>
    </View>
  );
}
