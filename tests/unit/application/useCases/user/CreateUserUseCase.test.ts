import { CreateUserUseCase } from '../../../../../src/application/useCases/user/CreateUserUseCase';
import { UserRepository } from '../../../../../src/application/ports/repositories/UserRepository';
import { User } from '../../../../../src/domain/entities/User';
import { Email } from '../../../../../src/domain/valueObjects/Email';
import { Password } from '../../../../../src/domain/valueObjects/Password';
import { CreateUserDTO } from '../../../../../src/application/dtos/UserDTO';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    };

    createUserUseCase = new CreateUserUseCase(mockUserRepository);
  });

  it('should create a user and return a DTO', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const createUserDTO: CreateUserDTO = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123'
    };

    const result = await createUserUseCase.execute(createUserDTO);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER'
    }));
  });

  it('should throw an error if user with email already exists', async () => {
    const existingUser = User.create({
      name: 'Existing User',
      email: Email.create('test@example.com'),
      password: Password.create('Password123')
    });

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    const createUserDTO: CreateUserDTO = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123'
    };

    await expect(createUserUseCase.execute(createUserDTO)).rejects.toThrow('User with email test@example.com already exists');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
