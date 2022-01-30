import * as React from 'react';
import { useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

import { AuthContext } from '../contexts/authContext';
import { __ } from '../localization/Localization';

export default function LoginScreen() {
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  const auth = useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login!</Text>

      <TextInput
        onChangeText={onChangeUsername}
        value={username}
        placeholder={__('Username')}
        keyboardType="email-address"
        textContentType="emailAddress"
      />

      <TextInput
        onChangeText={onChangePassword}
        value={password}
        placeholder={__('Password')}
        keyboardType="default"
        secureTextEntry={true}
      />

      <TouchableOpacity
        onPress={() => {
          auth.login(username, password).catch((error) => {
            console.log('Login failed!', error);
          });
        }}>
        <Text>{__('Log in')}</Text>
      </TouchableOpacity>
    </View>
  );
}
