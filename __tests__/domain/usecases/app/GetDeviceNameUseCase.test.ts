import { describe, expect, it } from '@jest/globals';
import { GetDeviceNameUseCase } from '@usecases/app/GetDeviceNameUseCase';

describe('GetDeviceNameUseCase', () => {
  it('returns the device name', () => {
    const deviceName = new GetDeviceNameUseCase().execute();

    expect(deviceName).toBe('mock');
  });
});
