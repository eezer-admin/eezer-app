import { describe, expect, it } from '@jest/globals';
import Logo from '@src/presentation/ui/Logo';
import { render, screen } from '@testing-library/react-native';

describe('Logo', () => {
  it('renders correctly', async () => {
    await render(<Logo />);
    expect(screen.toJSON()).toMatchSnapshot();
  });
});
