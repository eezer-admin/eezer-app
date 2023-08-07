import { describe, expect, it } from '@jest/globals';
import Logo from '@src/presentation/ui/Logo';
import renderer from 'react-test-renderer';

describe('Logo', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Logo />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
