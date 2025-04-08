import { Service } from 'typedi';
import { UserId } from '../../../domain/valueObjects/UserId';
import { UserRepository } from '../../ports/repositories/UserRepository';
import { UserDTO, UserMapper } from '../../dtos/UserDTO';

@Service()
export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(id: string): Promise<UserDTO> {
    const userId = UserId.fromString(id);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return UserMapper.toDTO(user);
  }
}
