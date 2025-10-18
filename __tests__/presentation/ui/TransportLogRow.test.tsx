import { describe, expect, it } from '@jest/globals';
import TransportLogRow from '@presentation/ui/TransportLogRow';
import { TRANSPORT_REASON } from '@src/Constants';
import { Transport } from '@src/domain/entities/Transport';
import { render, screen } from '@testing-library/react-native';

describe('TransportLogRow', () => {
  it('renders correctly', () => {
    const transport = new Transport({ reason: TRANSPORT_REASON.ACCIDENT });
    render(<TransportLogRow transport={transport} />);

    expect(screen.toJSON()).toMatchSnapshot();
  });
});
