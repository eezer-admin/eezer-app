import * as React from 'react';
import { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AuthContext } from '../../../contexts/authContext';
import { __ } from '../../../localization/Localization';
import Styles from '../../../styles/Styles';

type VehicleSelectorProps = {
  onNoVehiclesAvailable(): void;
  onVehicleSelected(vehicleId: number): void;
  vehicleId: number | null;
};

export default function VehicleSelector(props: VehicleSelectorProps) {
  const auth = useContext(AuthContext);

  if (!auth.user?.vehicles?.length) {
    props.onNoVehiclesAvailable();

    return (
      <View
        style={{
          padding: Styles.margins.large,
          margin: Styles.margins.medium,
          backgroundColor: Styles.colors.redLight,
          borderRadius: 8,
        }}>
        <Text>{__('No vehicles available. Contact an administrator.')}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={{ fontSize: Styles.fontSizes.default }}>{__('Select vehicle')}</Text>
      <View style={{ flexDirection: 'row' }}>
        {auth.user.vehicles.map((vehicle) => (
          <TouchableOpacity
            style={{
              padding: Styles.margins.large,
              margin: Styles.margins.medium,
              width: 100,
              height: 80,
              borderColor: Styles.colors.gray,
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: props.vehicleId === vehicle.id ? Styles.colors.gray : 'transparent',
            }}
            key={`vehicle-${vehicle.id}`}
            onPress={() => {
              props.onVehicleSelected(vehicle.id);
            }}>
            <Text style={{ fontSize: Styles.fontSizes.medium }}>{vehicle.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
