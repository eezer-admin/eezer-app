import { BACKGROUND_LOCATION_TASK_NAME } from '@src/Constants';
import * as Location from 'expo-location';

export default class StopWatchingLocationUseCase {
  public async execute(): Promise<void> {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK_NAME);

    if (hasStarted) {
      Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK_NAME);
    }
  }
}
