import * as Location from 'expo-location';

export default class RequestBackgroundLocationPermissionUseCase {
  public async execute(): Promise<Location.PermissionResponse> {
    // Must be requested before getting background location permission.
    await Location.requestForegroundPermissionsAsync();

    return await Location.requestBackgroundPermissionsAsync();
  }
}
