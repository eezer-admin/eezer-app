import * as Location from 'expo-location';
import { LocationAccuracy, LocationObject, LocationOptions } from 'expo-location';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import Logo from '../components/Logo';
import { TransportContext } from '../contexts/transportContext';
import TransportModel from '../models/TransportModel';
import Styles from '../styles/Styles';
import { TransportCoordinate } from '../types/Transports';

let locationService;

export default function StopTransportationScreen({ route, navigation }) {
  const context = useContext(TransportContext);
  const transport = context.data as TransportModel;

  if (!transport) {
    return null;
  }

  const [duration, setDuration] = useState(transport.getReadableDuration());

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
          accuracy: LocationAccuracy.BestForNavigation,
          distanceInterval: 10,
        } as LocationOptions,
        (location: LocationObject) => {
          if (transport.isNotOngoing()) {
            return;
          }

          context.save(
            transport.addCoordinates({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              altitude: location.coords.altitude,
              timestamp: new Date(location.timestamp).toISOString(),
            } as TransportCoordinate)
          );
        }
      );
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(transport.getReadableDuration());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={Styles.container}>
      <Logo />

      <TouchableOpacity
        style={{ ...Styles.button, ...Styles.button.red }}
        onPress={() => {
          context.save(transport.stop());
          locationService?.remove();

          navigation.navigate('CompleteTransportation');
        }}>
        <Text>Stop</Text>
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
