import { TransportCoordinate } from '@interfaces/Transport';
import Logo from '@src/presentation/ui/Logo';
import { AddCoordinatesToTransportUseCase } from '@usecases/transport/AddCoordinatesToTransportUseCase';
import { StopTransportUseCase } from '@usecases/transport/StopTransportUseCase';
import * as Location from 'expo-location';
import { LocationAccuracy, LocationObject, LocationOptions } from 'expo-location';
import { LocationSubscription } from 'expo-location/src/Location.types';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { TransportContext } from '../../../../contexts/transportContext';
import { __ } from '../../../../localization/Localization';
import Styles from '../../../../styles/Styles';

let locationService: LocationSubscription;

export default function StopTransportationScreen({ route, navigation }) {
  const context = useContext(TransportContext);
  const [duration, setDuration] = useState(context.transport.getReadableDuration());

  const stopTransport = async () => {
    locationService.remove();

    const transport = await new StopTransportUseCase().execute(context.transport);

    context.setTransport(transport);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Error');
        // setErrorMsg('Permission to access location was denied');
        return;
      }

      locationService = await Location.watchPositionAsync(
        {
          accuracy: LocationAccuracy.Highest,
          distanceInterval: 5,
        } as LocationOptions,
        async (location: LocationObject) => {
          const transport = await new AddCoordinatesToTransportUseCase().execute(context.transport, {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
            timestamp: new Date(location.timestamp).toISOString(),
          } as TransportCoordinate);

          context.setTransport(transport);
        }
      );
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(context.transport.getReadableDuration());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={Styles.container}>
      <Logo />

      {context.transport.isEnded() ? (
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
      ) : (
        <TouchableOpacity
          style={{ ...Styles.button, ...Styles.button.red }}
          onPress={() => {
            stopTransport();
          }}>
          <Text style={{ ...Styles.text.default, ...Styles.button.red.text }}>{__('Stop')}</Text>
        </TouchableOpacity>
      )}

      <View style={{ ...Styles.input, marginVertical: Styles.margins.medium }}>
        <Text style={{ ...Styles.text.default }}>{duration}</Text>
      </View>
      <View style={{ ...Styles.input }}>
        <Text style={{ ...Styles.text.default }}>{context.transport.getReadableDistance()}</Text>
      </View>
    </View>
  );
}
/**
TaskManager.defineTask(LOCATION_TRACKING, ({ data, error }) => {
  console.log('Started bg task');

  if (error) {
    console.log('Error in bg task: ', error.message);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];

    if (!location) {
    }

    //TransportProvider({
    //  latitude: location.coords.latitude,
    //  longitude: location.coords.longitude,
    //  altitude: location.coords.altitude,
    //});
  }
});
**/
