import { Service } from 'typedi';
import { Email } from '../../../domain/valueObjects/Email';
import { UserRepository } from '../../ports/repositories/UserRepository';
import { AuthService } from '../../ports/services/AuthService';
import { LoginUserDTO, AuthUserDTO } from '../../dtos/UserDTO';

@Service()
export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService
  ) {}

  public async execute(dto: LoginUserDTO): Promise<AuthUserDTO> {
    const email = Email.create(dto.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.validatePassword(dto.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = await this.authService.generateToken(user);

    return {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      role: user.getRole().getValue(),
      token
    };
  }
}
