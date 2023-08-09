import Logo from '@src/presentation/ui/Logo';
import * as React from 'react';
import { useContext } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { TransportContext } from '../../../../contexts/transportContext';
import { __ } from '../../../../localization/Localization';
import Styles from '../../../../styles/Styles';

export default function TransportationSummaryScreen({ route, navigation }) {
  const context = useContext(TransportContext);
  const { duration, distance } = route.params;

  React.useEffect(() => {
    context.resetTransport();
  }, []);

  return (
    <View style={Styles.container}>
      <Logo />

      <TouchableOpacity
        style={{ ...Styles.button, ...Styles.button.green, marginTop: Styles.margins.medium }}
        onPress={() => {
          navigation.navigate('CreateTransportation');
        }}>
        <Image
          source={require('../../../../assets/icon-check.png')}
          style={{
            width: 75,
            height: 75,
          }}
        />
        <Text style={{ ...Styles.text.default }}>{__('Back to start')}</Text>
      </TouchableOpacity>

      <View style={{ ...Styles.input, marginVertical: Styles.margins.medium }}>
        <Text style={{ ...Styles.text.default }}>{duration}</Text>
      </View>
      <View style={{ ...Styles.input }}>
        <Text style={{ ...Styles.text.default }}>{distance}</Text>
      </View>
    </View>
  );
}
