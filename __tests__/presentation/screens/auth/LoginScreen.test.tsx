import { describe, expect, it } from '@jest/globals';
import LoginScreen from '@presentation/screens/auth/LoginScreen';
import renderer from 'react-test-renderer';

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<LoginScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
