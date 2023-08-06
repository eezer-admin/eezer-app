import { describe, expect, it } from '@jest/globals';
import { Transport } from '@src/domain/entities/Transport';
import { SortTransportLogUseCase } from '@usecases/transport/SortTransportLogUseCase';

describe('SortTransportLogUseCase', () => {
  const transport1 = new Transport({ started: '2023-01-02T10:00:00.000Z' });
  const transport2 = new Transport({ started: '2023-01-05T10:15:00.000Z' });
  const transport3 = new Transport({ started: '2023-01-05T10:00:00.000Z' });

  it('returns an empty array if an empty array is provided', async () => {
    const result = new SortTransportLogUseCase().execute([]);

    expect(result).toEqual([]);
  });

  it('sorts the list by start date', async () => {
    const result = await new SortTransportLogUseCase().execute([transport1, transport2, transport3]);

    expect(result[0].identifier).toEqual(transport2.identifier);
    expect(result[1].identifier).toEqual(transport3.identifier);
    expect(result[2].identifier).toEqual(transport1.identifier);
  });
});
