import Logo from '@src/presentation/ui/Logo';
import * as React from 'react';
import { useContext } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { LanguageContext } from '../contexts/languageContext';
import { TransportContext } from '../contexts/transportContext';
import { TransportLogContext } from '../contexts/transportLogContext';
import { __ } from '../localization/Localization';
import TransportModel from '../models/TransportModel';
import Styles from '../styles/Styles';

export default function CompleteTransportationScreen({ route, navigation }) {
  useContext(LanguageContext);
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
        <Text style={{ ...Styles.text.default }}>{transport.getReadableDuration()}</Text>
      </View>
      <View style={{ ...Styles.input }}>
        <Text style={{ ...Styles.text.default }}>{transport.getReadableDistance()}</Text>
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
        <Text style={{ ...Styles.text.default }}>{__('Back to start')}</Text>
      </TouchableOpacity>
    </View>
  );
}
