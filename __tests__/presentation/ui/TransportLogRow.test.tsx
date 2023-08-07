import { describe, expect, it } from '@jest/globals';
import renderer from 'react-test-renderer';

import TransportLogRow from '@presentation/ui/TransportLogRow';
import { TRANSPORT_REASON } from '@src/Constants';
import { Transport } from '@src/domain/entities/Transport';

describe('TransportLogRow', () => {
  it('renders correctly', () => {
    const transport = new Transport({ reason: TRANSPORT_REASON.ACCIDENT });
    const tree = renderer.create(<TransportLogRow transport={transport} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
