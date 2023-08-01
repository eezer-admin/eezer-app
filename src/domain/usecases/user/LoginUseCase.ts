import { AuthRepository } from '@interfaces/AuthRepository';
import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { container } from '@src/di/Container';
import { User } from '@src/domain/entities/User';
import { GetDeviceNameUseCase } from '@usecases/app/GetDeviceNameUseCase';

export class LoginUseCase {
  private authRepository: AuthRepository;
  private databaseRepository: DatabaseRepository;

  constructor() {
    this.authRepository = container.resolve('AuthRepository');
    this.databaseRepository = container.resolve('DatabaseRepository');
  }

  async execute(email: string, password: string): Promise<User> {
    const deviceName = new GetDeviceNameUseCase().execute();
    const user = await this.authRepository.login(email, password, deviceName);

    await this.databaseRepository.store('USER', user);

    return user;
  }
}
