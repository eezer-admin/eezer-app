import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function StartTransportationScreen({ route, navigation }) {
  const { type } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Start transportation!</Text>
      <Text>{type}</Text>

      <TouchableOpacity
        onPress={() => {
          // Todo: Create navigation and populate it to params.
          navigation.navigate('StopTransportation', { transportation: null });
        }}>
        <Text>Start</Text>
      </TouchableOpacity>
    </View>
  );
}
