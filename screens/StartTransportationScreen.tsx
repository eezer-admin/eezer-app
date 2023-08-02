import Logo from '@src/presentation/ui/Logo';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import VehicleSelector from '../components/VehicleSelector';
import { TransportContext } from '../contexts/transportContext';
import { __ } from '../localization/Localization';
import TransportModel from '../models/TransportModel';
import Styles from '../styles/Styles';

export default function StartTransportationScreen({ route, navigation }) {
  const { reason } = route.params;
  const context = useContext(TransportContext);
  const [vehicleId, setVehicleId] = useState(null);
  const transport = new TransportModel(null);

  useEffect(() => {
    if (vehicleId) {
      transport.setVehicleId(vehicleId);
    }
  }, [vehicleId]);

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
            <Text>{transport.getReadableDuration()}</Text>
          </View>
          <View style={{ ...Styles.input }}>
            <Text>{transport.getReadableDistance()}</Text>
          </View>

          <TouchableOpacity
            style={{
              ...Styles.button,
              ...Styles.button.green,
              marginTop: Styles.margins.medium,
              marginBottom: Styles.margins.large,
            }}
            onPress={() => {
              context.start(reason, vehicleId).then((transport: TransportModel) => {
                context.save(transport).then(() => {
                  navigation.navigate('StopTransportation', { reason: route.params.reason });
                });
              });
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
