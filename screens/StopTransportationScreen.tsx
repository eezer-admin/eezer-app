import * as React from 'react';
import { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { TransportContext } from '../contexts/transportContext';

export default function StopTransportationScreen({ route, navigation }) {
  const transport = useContext(TransportContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Stop transportation!</Text>

      <TouchableOpacity
        onPress={() => {
          transport.stop().then(() => {
            navigation.navigate('CompleteTransportation');
          });
        }}>
        <Text>Stop</Text>
      </TouchableOpacity>
    </View>
  );
}
