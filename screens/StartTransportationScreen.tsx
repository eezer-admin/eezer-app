import * as React from 'react';
import { useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import Logo from '../components/Logo';
import { TransportContext } from '../contexts/transportContext';
import { __ } from '../localization/Localization';
import TransportModel from '../models/TransportModel';
import Styles from '../styles/Styles';

export default function StartTransportationScreen({ route, navigation }) {
  const { reason } = route.params;
  const context = useContext(TransportContext);
  const transport = new TransportModel(null);

  return (
    <View style={Styles.container}>
      <Logo />

      <TouchableOpacity
        style={{ ...Styles.button, ...Styles.button.green }}
        onPress={() => {
          context.start(reason).then((transport: TransportModel) => {
            context.save(transport).then(() => {
              navigation.navigate('StopTransportation', { reason: route.params.reason });
            });
          });
        }}>
        <Text>{__('Start')}</Text>
      </TouchableOpacity>

      <View style={{ ...Styles.input, marginVertical: Styles.margins.medium }}>
        <Text>{transport.getReadableDuration()}</Text>
      </View>
      <View style={{ ...Styles.input }}>
        <Text>{transport.getReadableDistance()}</Text>
      </View>
    </View>
  );
}
