import { describe, expect, it } from '@jest/globals';
import { DrawerNavigation } from '@presentation/ui/DrawerNavigation';
import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '../../../contexts/authContext';

describe('DrawerNavigation', () => {
  it('renders correctly', () => {
    render(
      <SafeAreaProvider>
        <AuthProvider>
          <DrawerNavigation />
        </AuthProvider>
      </SafeAreaProvider>
    );

    expect(screen.toJSON()).toMatchSnapshot();
  });
});
