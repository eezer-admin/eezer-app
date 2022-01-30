import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function StopTransportationScreen({ route, navigation }) {
  const { transportation } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Stop transportation!</Text>

      <TouchableOpacity
        onPress={() => {
          // Todo: Stop transportation.
          navigation.navigate('CompleteTransportation', { transportation });
        }}>
        <Text>Stop</Text>
      </TouchableOpacity>
    </View>
  );
}
