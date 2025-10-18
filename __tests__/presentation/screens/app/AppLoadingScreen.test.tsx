import { describe, expect, it } from '@jest/globals';
import AppLoadingScreen from '@presentation/screens/app/AppLoadingScreen';
import { render, screen } from '@testing-library/react-native';

describe('AppLoadingScreen', () => {
  it('renders correctly', () => {
    render(<AppLoadingScreen />);
    expect(screen.toJSON()).toMatchSnapshot();
  });
});
