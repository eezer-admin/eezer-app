import { describe, expect, it } from '@jest/globals';
import LoginScreen from '@presentation/screens/auth/LoginScreen';
import { render, screen } from '@testing-library/react-native';

describe('LoginScreen', () => {
  it('renders correctly', () => {
    render(<LoginScreen />);
    expect(screen.toJSON()).toMatchSnapshot();
  });
});
