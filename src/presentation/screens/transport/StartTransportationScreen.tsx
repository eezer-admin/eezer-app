import { TransportCoordinate } from '@interfaces/Transport';
import VehicleSelector from '@presentation/ui/VehicleSelector';
import { BACKGROUND_LOCATION_TASK_NAME } from '@src/Constants';
import Logo from '@src/presentation/ui/Logo';
import GetBackgroundLocationPermissionUseCase from '@usecases/location/GetBackgroundLocationPermissionUseCase';
import WatchLocationUseCase from '@usecases/location/WatchLocationUseCase';
import { AddCoordinatesToTransportUseCase } from '@usecases/transport/AddCoordinatesToTransportUseCase';
import { StartTransportUseCase } from '@usecases/transport/StartTransportUseCase';
import * as TaskManager from 'expo-task-manager';
import * as React from 'react';
import { useContext, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { TransportContext } from '../../../../contexts/transportContext';
import { __ } from '../../../../localization/Localization';
import Styles from '../../../../styles/Styles';

export default function StartTransportationScreen({ route, navigation }) {
  const { reason } = route.params;
  const context = useContext(TransportContext);
  const [vehicleId, setVehicleId] = useState(null);

  const registerLocationTask = React.useCallback(() => {
    TaskManager.defineTask(
      BACKGROUND_LOCATION_TASK_NAME,
      async ({ data: { locations }, error }: TaskManager.TaskManagerTaskBody<any>) => {
        const location = locations[0];

        if (!location || !context.transport.isOngoing()) {
          return;
        }

        const transport = await new AddCoordinatesToTransportUseCase().execute(context.transport, {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude,
          timestamp: new Date(location.timestamp).toISOString(),
        } as TransportCoordinate);

        context.setTransport(transport);
      }
    );
  }, [context.transport]);

  const startTransport = async () => {
    if (!vehicleId) {
      return null;
    }

    const permission = await new GetBackgroundLocationPermissionUseCase().execute();

    if (permission.granted) {
      registerLocationTask();
    }

    context.transport.reason = reason;
    context.transport.vehicleId = vehicleId;

    const transport = await new StartTransportUseCase().execute(context.transport);

    context.setTransport(transport);

    if (permission.granted) {
      await new WatchLocationUseCase().execute();
    }

    navigation.navigate('StopTransportation', { reason });
  };

  return (
    <View style={Styles.container}>
      <Logo />

      <View
        style={{
          marginBottom: Styles.margins.large * 2,
          borderBottomWidth: 1,
          borderBottomColor: Styles.colors.gray,
          width: '100%',
          marginHorizontal: Styles.margins.large,
        }}>
        <VehicleSelector
          onNoVehiclesAvailable={() => {
            setVehicleId(null);
          }}
          onVehicleSelected={setVehicleId}
          vehicleId={vehicleId}
        />
      </View>

      {vehicleId && (
        <View style={{ ...Styles.container, flex: 0 }}>
          <View style={{ ...Styles.input, marginVertical: Styles.margins.medium }}>
            <Text>{context.transport.getReadableDuration()}</Text>
          </View>
          <View style={{ ...Styles.input }}>
            <Text>{context.transport.getReadableDistance()}</Text>
          </View>

          <TouchableOpacity
            style={{
              ...Styles.button,
              ...Styles.button.green,
              marginTop: Styles.margins.medium,
              marginBottom: Styles.margins.large,
            }}
            onPress={() => {
              startTransport();
            }}>
            <Text>{__('Start')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={{ marginTop: Styles.margins.large * 3 }}
        onPress={() => {
          navigation.navigate('CreateTransportation');
        }}>
        <Text>{__('Go back')}</Text>
      </TouchableOpacity>
    </View>
  );
}
