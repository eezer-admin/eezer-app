import { TransportCoordinate } from '@interfaces/Transport';
import { Transport } from '@src/domain/entities/Transport';
import { getDistance } from 'geolib';

export class AddCoordinatesToTransportUseCase {
  execute(transport: Transport, coordinates: TransportCoordinate): Transport {
    if (!transport.isOngoing()) {
      return transport;
    }

    if (transport.coordinates.length > 0) {
      const previousLocation = transport.coordinates[transport.coordinates.length - 1];
      try {
        transport.distanceMeters += getDistance(previousLocation, coordinates);
      } catch (err) {
        console.warn('Unable to get distance.', err);
      }

      transport.coordinates.push(coordinates);
    } else {
      transport.coordinates = [coordinates];
    }

    return transport;
  }
}
