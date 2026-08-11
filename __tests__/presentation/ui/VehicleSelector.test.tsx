import { describe, expect, it } from '@jest/globals';
import VehicleSelector from '@presentation/ui/VehicleSelector';
import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '../../../contexts/authContext';

describe('VehicleSelector', () => {
  it('renders correctly', async () => {
    await render(
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
    );

    expect(screen.toJSON()).toMatchSnapshot();
  });
});
