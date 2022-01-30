import * as React from 'react';
import { useContext } from 'react';
import { View, Text } from 'react-native';

import { AuthContext } from '../contexts/authContext';

export default function ProfileScreen() {
  const auth = useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>
        {auth.user.first_name} {auth.user.last_name}
      </Text>
      <Text>{auth.user.email}</Text>
    </View>
  );
}
