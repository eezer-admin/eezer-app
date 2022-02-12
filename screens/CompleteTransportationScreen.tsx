import * as React from 'react';
import { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { TransportContext } from '../contexts/transportContext';
import { Transport } from '../types/Transports';

export default function CompleteTransportationScreen({ route, navigation }) {
  const transport = useContext(TransportContext);

  console.log('Complete transport!', transport.data);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Complete transport!</Text>

      <TouchableOpacity
        onPress={() => {
          transport.complete().then(() => {
            navigation.navigate('CreateTransportation');
          });
        }}>
        <Text>Back to start</Text>
      </TouchableOpacity>
    </View>
  );
}
