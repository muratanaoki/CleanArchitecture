import { Service } from 'typedi';
import { UserId } from '../../../domain/valueObjects/UserId';
import { Email } from '../../../domain/valueObjects/Email';
import { Password } from '../../../domain/valueObjects/Password';
import { UserRepository } from '../../ports/repositories/UserRepository';
import { UpdateUserDTO } from '../../dtos/UserDTO';
import { UserDTO, UserMapper } from '../../dtos/UserDTO';

@Service()
export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(id: string, dto: UpdateUserDTO): Promise<UserDTO> {
    const userId = UserId.fromString(id);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    if (dto.name) {
      user.updateName(dto.name);
    }

    if (dto.email) {
      const email = Email.create(dto.email);
      
      if (!user.getEmail().equals(email)) {
        const existingUser = await this.userRepository.findByEmail(email);
        
        if (existingUser && !existingUser.getId().equals(user.getId())) {
          throw new Error(`User with email ${dto.email} already exists`);
        }
        
        user.updateEmail(email);
      }
    }

    if (dto.password) {
      const password = Password.create(dto.password);
      await user.updatePassword(password);
    }

    await this.userRepository.save(user);

    return UserMapper.toDTO(user);
  }
}
