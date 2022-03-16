import * as React from 'react';
import { useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import Logo from '../components/Logo';
import { TransportContext } from '../contexts/transportContext';
import { TransportLogContext } from '../contexts/transportLogContext';
import TransportModel from '../models/TransportModel';
import Styles from '../styles/Styles';

export default function CompleteTransportationScreen({ route, navigation }) {
  const context = useContext(TransportContext);
  const transport = context.data as TransportModel;

  if (!transport) {
    return null;
  }

  const log = useContext(TransportLogContext);

  return (
    <View style={Styles.container}>
      <Logo />

      <View style={{ ...Styles.input, marginVertical: Styles.margins.medium }}>
        <Text>{transport.getReadableDuration()}</Text>
      </View>
      <View style={{ ...Styles.input }}>
        <Text>{transport.getReadableDistance()}</Text>
      </View>

      <TouchableOpacity
        style={{ ...Styles.button, ...Styles.button.green, marginTop: Styles.margins.medium }}
        onPress={() => {
          log.add(transport).then(() => {
            context.completeTransport().then(() => {
              navigation.navigate('CreateTransportation');
            });
          });
        }}>
        <Image
          source={require('../assets/icon-check.png')}
          style={{
            width: 75,
            height: 75,
          }}
        />
        <Text>Back to start</Text>
      </TouchableOpacity>
    </View>
  );
}
