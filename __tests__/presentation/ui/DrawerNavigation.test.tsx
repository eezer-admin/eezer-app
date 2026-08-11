import { describe, expect, it } from '@jest/globals';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerNavigation } from '@presentation/ui/DrawerNavigation';
import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '../../../contexts/authContext';

describe('DrawerNavigation', () => {
  it('renders correctly', async () => {
    await render(
      <SafeAreaProvider>
        <AuthProvider>
          {/* The drawer props are supplied by the navigator at runtime. */}
          <DrawerNavigation {...({} as DrawerContentComponentProps)} />
        </AuthProvider>
      </SafeAreaProvider>
    );

    expect(screen.toJSON()).toMatchSnapshot();
  });
});
