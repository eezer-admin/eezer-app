import * as Location from 'expo-location';

export default class GetBackgroundLocationPermissionUseCase {
  public async execute(): Promise<Location.PermissionResponse> {
    return await Location.getBackgroundPermissionsAsync();
  }
}
