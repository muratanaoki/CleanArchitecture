import { DeleteUserUseCase } from '../../../../../src/application/useCases/user/DeleteUserUseCase';
import { UserRepository } from '../../../../../src/application/ports/repositories/UserRepository';
import { User } from '../../../../../src/domain/entities/User';
import { UserId } from '../../../../../src/domain/valueObjects/UserId';
import { Email } from '../../../../../src/domain/valueObjects/Email';
import { Password } from '../../../../../src/domain/valueObjects/Password';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
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

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository);
  });

  it('should delete a user', async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);

    await deleteUserUseCase.execute(userId.getValue());

    expect(mockUserRepository.findById).toHaveBeenCalledWith(expect.any(UserId));
    expect(mockUserRepository.delete).toHaveBeenCalledWith(expect.any(UserId));
  });

  it('should throw an error if user is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute(userId.getValue())).rejects.toThrow(`User with id ${userId.getValue()} not found`);
    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });
});
