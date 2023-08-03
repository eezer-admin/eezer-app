import { describe, expect, it } from '@jest/globals';
import ProfileScreen from '@presentation/screens/user/ProfileScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import renderer from 'react-test-renderer';

import { AuthProvider } from '../../../../contexts/authContext';

describe('ProfileScreen', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <SafeAreaProvider>
          <AuthProvider>
            <ProfileScreen />
          </AuthProvider>
        </SafeAreaProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
