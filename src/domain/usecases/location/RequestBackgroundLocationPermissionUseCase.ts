import * as Location from 'expo-location';

import GetBackgroundLocationPermissionUseCase from './GetBackgroundLocationPermissionUseCase';

export default class RequestBackgroundLocationPermissionUseCase {
  public async execute(): Promise<Location.PermissionResponse> {
    const response = await new GetBackgroundLocationPermissionUseCase().execute();

    // If user has already granted permission, return true.
    if (response.status === Location.PermissionStatus.GRANTED) {
      return response;
    }

    // User needs to be asked permission again.
    if (response.status === Location.PermissionStatus.UNDETERMINED) {
      return await Location.requestBackgroundPermissionsAsync();
    }

    return response;
  }
}
