import { describe, expect, it } from '@jest/globals';
import AppLoadingScreen from '@presentation/screens/app/AppLoadingScreen';
import renderer from 'react-test-renderer';

describe('AppLoadingScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<AppLoadingScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
