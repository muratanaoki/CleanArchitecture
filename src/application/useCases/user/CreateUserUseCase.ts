import { Service } from 'typedi';
import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/valueObjects/Email';
import { Password } from '../../../domain/valueObjects/Password';
import { UserRepository } from '../../ports/repositories/UserRepository';
import { CreateUserDTO } from '../../dtos/UserDTO';
import { UserDTO, UserMapper } from '../../dtos/UserDTO';

@Service()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(dto: CreateUserDTO): Promise<UserDTO> {
    const email = Email.create(dto.email);
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error(`User with email ${dto.email} already exists`);
    }

    const password = Password.create(dto.password);
    const user = User.create({
      name: dto.name,
      email,
      password
    });

    await this.userRepository.save(user);

    return UserMapper.toDTO(user);
  }
}
