import VehicleSelector from '@presentation/ui/VehicleSelector';
import Logo from '@src/presentation/ui/Logo';
import { StartTransportUseCase } from '@usecases/transport/StartTransportUseCase';
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

  const startTransport = async () => {
    if (!vehicleId) {
      return null;
    }

    context.transport.reason = reason;
    context.transport.vehicleId = vehicleId;

    const transport = await new StartTransportUseCase().execute(context.transport);

    context.setTransport(transport);

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
