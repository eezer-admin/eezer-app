import { TransportStackParamList } from '@interfaces/Navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Logo from '@src/presentation/ui/Logo';
import StopWatchingLocationUseCase from '@usecases/location/StopWatchingLocationUseCase';
import { StopTransportUseCase } from '@usecases/transport/StopTransportUseCase';
import * as React from 'react';
import { useContext, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { TransportContext } from '../../../../contexts/transportContext';
import { __ } from '../../../../localization/Localization';
import Styles from '../../../../styles/Styles';

export default function StopTransportationScreen({
  route,
  navigation,
}: NativeStackScreenProps<TransportStackParamList, 'StopTransportation'>) {
  const context = useContext(TransportContext);
  const [duration, setDuration] = useState(context.transport.getReadableDuration());

  const stopTransport = async () => {
    try {
      await new StopWatchingLocationUseCase().execute();
    } catch (err) {
      console.log('Failed stopping location watcher');
    }

    const transport = await new StopTransportUseCase().execute(context.transport);

    context.setTransport(transport);
    context.uploadTransportsIfConnectedToNetwork();

    navigation.navigate('TransportationSummary', {
      duration: context.transport.getReadableDuration(),
      distance: context.transport.getReadableDistance(),
    });
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDuration(context.transport.getReadableDuration());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={Styles.container}>
      <Logo />

      {context.transport.ended ? (
        <TouchableOpacity
          style={{ ...Styles.button, ...Styles.buttonGreen, marginTop: Styles.margins.medium }}
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
      ) : (
        <TouchableOpacity
          style={{ ...Styles.button, ...Styles.buttonRed }}
          onPress={() => {
            stopTransport();
          }}>
          <Text style={{ ...Styles.text.default, ...Styles.buttonRedText }}>{__('Stop')}</Text>
        </TouchableOpacity>
      )}

      <View style={{ ...Styles.field, marginVertical: Styles.margins.medium }}>
        <Text style={{ ...Styles.text.default }}>{duration}</Text>
      </View>
      <View style={{ ...Styles.field }}>
        <Text style={{ ...Styles.text.default }}>{context.transport.getReadableDistance()}</Text>
      </View>
    </View>
  );
}
