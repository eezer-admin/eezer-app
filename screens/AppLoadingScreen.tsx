import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';

import Styles from '../styles/Styles';

export default function AppLoadingScreen() {
  return (
    <View style={Styles.container}>
      <ActivityIndicator></ActivityIndicator>
    </View>
  );
}
