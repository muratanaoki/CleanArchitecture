import { GetUserByIdUseCase } from '../../../../../src/application/useCases/user/GetUserByIdUseCase';
import { UserRepository } from '../../../../../src/application/ports/repositories/UserRepository';
import { User } from '../../../../../src/domain/entities/User';
import { UserId } from '../../../../../src/domain/valueObjects/UserId';
import { Email } from '../../../../../src/domain/valueObjects/Email';
import { Password } from '../../../../../src/domain/valueObjects/Password';
import { Role, RoleValue } from '../../../../../src/domain/valueObjects/Role';

describe('GetUserByIdUseCase', () => {
  let getUserByIdUseCase: GetUserByIdUseCase;
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

    getUserByIdUseCase = new GetUserByIdUseCase(mockUserRepository);
  });

  it('should get a user by id and return a DTO', async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);

    const result = await getUserByIdUseCase.execute(userId.getValue());

    expect(mockUserRepository.findById).toHaveBeenCalledWith(expect.any(UserId));
    expect(result).toEqual(expect.objectContaining({
      id: userId.getValue(),
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER'
    }));
  });

  it('should throw an error if user is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(getUserByIdUseCase.execute(userId.getValue())).rejects.toThrow(`User with id ${userId.getValue()} not found`);
  });
});
