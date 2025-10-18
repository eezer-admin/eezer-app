import { describe, expect, it } from '@jest/globals';
import ProfileScreen from '@presentation/screens/user/ProfileScreen';
import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '../../../../contexts/authContext';

describe('ProfileScreen', () => {
  it('renders correctly', () => {
    render(
      <SafeAreaProvider>
        <AuthProvider>
          <ProfileScreen />
        </AuthProvider>
      </SafeAreaProvider>
    );
    expect(screen.toJSON()).toMatchSnapshot();
  });
});
