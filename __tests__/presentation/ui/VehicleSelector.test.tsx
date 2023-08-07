import { describe, expect, it } from '@jest/globals';
import VehicleSelector from '@presentation/ui/VehicleSelector';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import renderer from 'react-test-renderer';

import { AuthProvider } from '../../../contexts/authContext';

describe('VehicleSelector', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <SafeAreaProvider>
          <AuthProvider>
            <VehicleSelector
              onNoVehiclesAvailable={() => {
                console.log('onNoVehiclesAvailable');
              }}
              onVehicleSelected={() => {}}
              vehicleId={1}
            />
          </AuthProvider>
        </SafeAreaProvider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
