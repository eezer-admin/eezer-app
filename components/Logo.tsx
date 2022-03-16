import * as React from 'react';
import { Image } from 'react-native';

export default function Logo() {
  return (
    <Image
      style={{
        width: 250,
        height: 77.16,
        marginBottom: 50,
      }}
      source={require('../assets/logo.png')}
    />
  );
}
