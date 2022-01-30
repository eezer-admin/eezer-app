import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function CompleteTransportationScreen({ route, navigation }) {
  const { transportation } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Complete transportation!</Text>

      <TouchableOpacity
        onPress={() => {
          // Todo: Complete the transport.
          navigation.navigate('CreateTransportation');
        }}>
        <Text>Back to start</Text>
      </TouchableOpacity>
    </View>
  );
}
