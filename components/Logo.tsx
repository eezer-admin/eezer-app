import * as React from 'react';
import { Image } from 'react-native';

export default function Logo() {
  return (
    <Image
      style={{
        width: 240,
        height: 60,
        marginBottom: 50,
      }}
      source={require('../assets/logo.png')}
    />
  );
}
