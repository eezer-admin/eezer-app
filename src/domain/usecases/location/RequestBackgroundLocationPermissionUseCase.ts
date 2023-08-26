import * as Location from 'expo-location';

import GetBackgroundLocationPermissionUseCase from './GetBackgroundLocationPermissionUseCase';

export default class RequestBackgroundLocationPermissionUseCase {
  public async execute(): Promise<Location.PermissionResponse> {
    const response = await new GetBackgroundLocationPermissionUseCase().execute();

    // If user has already granted permission, return true.
    if (response.status === Location.PermissionStatus.GRANTED) {
      return response;
    }

    // Must be reuqested before getting background location permission.
    await Location.requestForegroundPermissionsAsync();

    // User needs to be asked permission again.
    return await Location.requestBackgroundPermissionsAsync();
  }
}
