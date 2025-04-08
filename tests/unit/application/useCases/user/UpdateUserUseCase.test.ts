import { UpdateUserUseCase } from '../../../../../src/application/useCases/user/UpdateUserUseCase';
import { UserRepository } from '../../../../../src/application/ports/repositories/UserRepository';
import { User } from '../../../../../src/domain/entities/User';
import { UserId } from '../../../../../src/domain/valueObjects/UserId';
import { Email } from '../../../../../src/domain/valueObjects/Email';
import { Password } from '../../../../../src/domain/valueObjects/Password';
import { UpdateUserDTO } from '../../../../../src/application/dtos/UserDTO';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
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

    jest.spyOn(mockUser, 'getId').mockReturnValue(userId);

    updateUserUseCase = new UpdateUserUseCase(mockUserRepository);
  });

  it('should update a user and return a DTO', async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const updateUserDTO: UpdateUserDTO = {
      name: 'Updated Name',
      email: 'updated@example.com'
    };

    const result = await updateUserUseCase.execute(userId.getValue(), updateUserDTO);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(expect.any(UserId));
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(expect.objectContaining({
      id: userId.getValue(),
      name: 'Updated Name',
      email: 'updated@example.com'
    }));
  });

  it('should throw an error if user is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    const updateUserDTO: UpdateUserDTO = {
      name: 'Updated Name'
    };

    await expect(updateUserUseCase.execute(userId.getValue(), updateUserDTO)).rejects.toThrow(`User with id ${userId.getValue()} not found`);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error if email already exists for another user', async () => {
    const existingUser = User.create({
      name: 'Existing User',
      email: Email.create('existing@example.com'),
      password: Password.create('Password123')
    });
    
    const existingUserId = UserId.create();
    jest.spyOn(existingUser, 'getId').mockReturnValue(existingUserId);

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    const updateUserDTO: UpdateUserDTO = {
      email: 'existing@example.com'
    };

    await expect(updateUserUseCase.execute(userId.getValue(), updateUserDTO)).rejects.toThrow('User with email existing@example.com already exists');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should update password if provided', async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);

    const updateUserDTO: UpdateUserDTO = {
      password: 'NewPassword123'
    };

    await updateUserUseCase.execute(userId.getValue(), updateUserDTO);

    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    
    const isValid = await mockUser.validatePassword('NewPassword123');
    expect(isValid).toBeTruthy();
  });
});
