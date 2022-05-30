import * as React from 'react';
import { useContext } from 'react';
import { View, Text } from 'react-native';

import { AuthContext } from '../contexts/authContext';
import Styles from '../styles/Styles';

export default function ProfileScreen() {
  const auth = useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        style={{
          marginBottom: Styles.margins.medium,
          ...Styles.text.default,
        }}>
        {auth.user.first_name} {auth.user.last_name}
      </Text>
      <Text style={{ ...Styles.text.default }}>{auth.user.email}</Text>
    </View>
  );
}
