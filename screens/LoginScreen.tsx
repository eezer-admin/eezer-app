import * as React from 'react';
import { useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

import Logo from '../components/Logo';
import { AuthContext } from '../contexts/authContext';
import { __ } from '../localization/Localization';
import Styles from '../styles/Styles';

export default function LoginScreen() {
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  const auth = useContext(AuthContext);

  return (
    <View style={Styles.container}>
      <Logo />

      <TextInput
        onChangeText={onChangeUsername}
        value={username}
        placeholder={__('Username')}
        keyboardType="email-address"
        textContentType="emailAddress"
        style={{ ...Styles.input, marginBottom: Styles.margins.medium }}
      />

      <TextInput
        onChangeText={onChangePassword}
        value={password}
        placeholder={__('Password')}
        keyboardType="default"
        secureTextEntry={true}
        style={{ ...Styles.input, marginBottom: Styles.margins.medium }}
      />

      <TouchableOpacity
        style={{
          ...Styles.button,
          ...Styles.button.green,
        }}
        onPress={() => {
          auth.login(username, password).catch((error) => {
            console.log('Login failed!', error);
          });
        }}>
        <Text style={Styles.button.text}>{__('Log in')}</Text>
      </TouchableOpacity>
    </View>
  );
}
