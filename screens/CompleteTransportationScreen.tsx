import * as React from 'react';
import { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { TransportContext } from '../contexts/transportContext';
import { TransportLogContext } from '../contexts/transportLogContext';
import TransportModel from '../models/TransportModel';

export default function CompleteTransportationScreen({ route, navigation }) {
  const context = useContext(TransportContext);
  const transport = context.data as TransportModel;

  if (!transport) {
    return null;
  }

  const log = useContext(TransportLogContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Complete transport!</Text>
      <Text>Duration: {transport.getReadableDuration()}</Text>

      <TouchableOpacity
        onPress={() => {
          log.add(transport).then(() => {
            context.completeTransport().then(() => {
              navigation.navigate('CreateTransportation');
            });
          });
        }}>
        <Text>Back to start</Text>
      </TouchableOpacity>
    </View>
  );
}
