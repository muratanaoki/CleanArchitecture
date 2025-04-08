import { LoginUseCase } from '../../../../../src/application/useCases/auth/LoginUseCase';
import { UserRepository } from '../../../../../src/application/ports/repositories/UserRepository';
import { AuthService } from '../../../../../src/application/ports/services/AuthService';
import { User } from '../../../../../src/domain/entities/User';
import { UserId } from '../../../../../src/domain/valueObjects/UserId';
import { Email } from '../../../../../src/domain/valueObjects/Email';
import { Password } from '../../../../../src/domain/valueObjects/Password';
import { Role } from '../../../../../src/domain/valueObjects/Role';
import { LoginUserDTO } from '../../../../../src/application/dtos/UserDTO';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockUser: User;
  let userId: UserId;

  beforeEach(() => {
    userId = UserId.create();
    
    mockUser = User.create({
      name: 'Test User',
      email: Email.create('test@example.com'),
      password: Password.create('Password123')
    });

    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    };

    mockAuthService = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
      getUserIdFromToken: jest.fn()
    };

    jest.spyOn(mockUser, 'getId').mockReturnValue(userId);
    
    jest.spyOn(mockUser, 'validatePassword').mockImplementation(async (password) => {
      return password === 'Password123';
    });

    loginUseCase = new LoginUseCase(mockUserRepository, mockAuthService);
  });

  it('should login a user and return a token', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockAuthService.generateToken.mockResolvedValue('jwt-token');

    const loginUserDTO: LoginUserDTO = {
      email: 'test@example.com',
      password: 'Password123'
    };

    const result = await loginUseCase.execute(loginUserDTO);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
    expect(mockUser.validatePassword).toHaveBeenCalledWith('Password123');
    expect(mockAuthService.generateToken).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(expect.objectContaining({
      id: userId.getValue(),
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
      token: 'jwt-token'
    }));
  });

  it('should throw an error if user is not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const loginUserDTO: LoginUserDTO = {
      email: 'nonexistent@example.com',
      password: 'Password123'
    };

    await expect(loginUseCase.execute(loginUserDTO)).rejects.toThrow('Invalid email or password');
    expect(mockAuthService.generateToken).not.toHaveBeenCalled();
  });

  it('should throw an error if password is incorrect', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    const loginUserDTO: LoginUserDTO = {
      email: 'test@example.com',
      password: 'WrongPassword'
    };

    await expect(loginUseCase.execute(loginUserDTO)).rejects.toThrow('Invalid email or password');
    expect(mockAuthService.generateToken).not.toHaveBeenCalled();
  });
});
