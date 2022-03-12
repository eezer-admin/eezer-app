import * as React from 'react';
import { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { TransportContext } from '../contexts/transportContext';

export default function StartTransportationScreen({ route, navigation }) {
  const { type } = route.params;
  const context = useContext(TransportContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Start transportation!</Text>
      <Text>{type}</Text>

      <TouchableOpacity
        onPress={() => {
          context.start(type).then(() => {
            navigation.navigate('StopTransportation');
          });
        }}>
        <Text>Start</Text>
      </TouchableOpacity>
    </View>
  );
}
