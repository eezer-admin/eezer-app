import * as React from 'react';
import { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { TransportContext } from '../contexts/transportContext';
import { TransportLogContext } from '../contexts/transportLogContext';
import { add as addToLog } from '../services/TransportLogService';

export default function CompleteTransportationScreen({ route, navigation }) {
  const transport = useContext(TransportContext);

  if (!transport.data) {
    return null;
  }

  const [log, setLog] = useContext(TransportLogContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Complete transport!</Text>

      <TouchableOpacity
        onPress={() => {
          addToLog(transport.data).then((log) => {
            setLog(log);
            transport.complete().then(() => {
              navigation.navigate('CreateTransportation');
            });
          });
        }}>
        <Text>Back to start</Text>
      </TouchableOpacity>
    </View>
  );
}
