import { BackendRepository } from '@interfaces/BackendRepository';
import { DatabaseRepository } from '@interfaces/DatabaseRepository';
import { STORAGE_KEYS } from '@src/Constants';
import { container } from '@src/di/Container';
import { User } from '@src/domain/entities/User';
import { GetDeviceNameUseCase } from '@usecases/app/GetDeviceNameUseCase';

export class LoginUseCase {
  private backendRepository: BackendRepository;
  private databaseRepository: DatabaseRepository;

  constructor() {
    this.backendRepository = container.resolve('BackendRepository');
    this.databaseRepository = container.resolve('DatabaseRepository');
  }

  async execute(email: string, password: string): Promise<User> {
    const deviceName = new GetDeviceNameUseCase().execute();
    const user = await this.backendRepository.login(email, password, deviceName);

    await this.databaseRepository.store(STORAGE_KEYS.USER, user);

    return user;
  }
}
