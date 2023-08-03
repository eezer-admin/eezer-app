import { describe, expect, it } from '@jest/globals';
import { Transport } from '@src/domain/entities/Transport';
import { AddCoordinatesToTransportUseCase } from '@usecases/transport/AddCoordinatesToTransportUseCase';

describe('AddCoordinatesToTransportUseCase', () => {
  it('does nothing if the transport is not ongoing', () => {
    const transport = new Transport({ started: new Date().toISOString(), ended: new Date().toISOString() });

    const result = new AddCoordinatesToTransportUseCase().execute(transport, {
      latitude: 1,
      longitude: 1,
      altitude: 0,
      timestamp: new Date().toISOString(),
    });

    expect(result).toBe(transport);
    expect(transport.coordinates.length).toBe(0);
  });

  it('adds the coordinates to the transport', () => {
    const transport = new Transport({ started: new Date().toISOString(), ended: null });
    const coordinates = {
      latitude: 1,
      longitude: 1,
      altitude: 0,
      timestamp: new Date().toISOString(),
    };

    const result = new AddCoordinatesToTransportUseCase().execute(transport, coordinates);

    expect(result).toBe(transport);
    expect(transport.coordinates.length).toBe(1);
    expect(transport.coordinates[0]).toBe(coordinates);
  });

  it('calculates the distance between the previous location and the new location', () => {
    const transport = new Transport({ started: new Date().toISOString(), ended: null });

    // Norrköping.
    transport.coordinates = [
      {
        latitude: 58.5866375,
        longitude: 16.1016839,
        altitude: 0,
        timestamp: new Date().toISOString(),
      },
    ];

    // Linköping.
    const result = new AddCoordinatesToTransportUseCase().execute(transport, {
      latitude: 58.403762,
      longitude: 15.528203,
      altitude: 0,
      timestamp: new Date().toISOString(),
    });

    expect(result).toBe(transport);
    expect(transport.coordinates.length).toBe(2);
    expect(transport.distanceMeters).toBe(39081);
  });
});
