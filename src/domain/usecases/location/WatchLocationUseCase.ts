import { BACKGROUND_LOCATION_TASK_NAME } from '@src/Constants';
import * as Location from 'expo-location';

import GetBackgroundLocationPermissionUseCase from './GetBackgroundLocationPermissionUseCase';

export default class WatchLocationUseCase {
  public async execute(): Promise<void> {
    const permission = await new GetBackgroundLocationPermissionUseCase().execute();

    if (!permission.granted) {
      return;
    }

    Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 20,
      timeInterval: 30000,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Eezer is reading your position',
        notificationBody: 'Eezer uses your location to log the distance for your transport.',
      },
    });
  }
}
