import * as Device from 'expo-device';

export class GetDeviceNameUseCase {
  execute(): string {
    return Device.deviceName || Device.modelName || 'Unknown device';
  }
}
