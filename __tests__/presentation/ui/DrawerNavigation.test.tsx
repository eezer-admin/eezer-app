import { describe, expect, it } from '@jest/globals';
import { DrawerNavigation } from '@presentation/ui/DrawerNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import renderer from 'react-test-renderer';

import { AuthProvider } from '../../../contexts/authContext';

describe('DrawerNavigation', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <SafeAreaProvider>
          <AuthProvider>
            <DrawerNavigation />
          </AuthProvider>
        </SafeAreaProvider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
