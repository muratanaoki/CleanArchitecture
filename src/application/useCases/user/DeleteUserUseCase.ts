import { Service } from 'typedi';
import { UserId } from '../../../domain/valueObjects/UserId';
import { UserRepository } from '../../ports/repositories/UserRepository';

@Service()
export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(id: string): Promise<void> {
    const userId = UserId.fromString(id);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    await this.userRepository.delete(userId);
  }
}
