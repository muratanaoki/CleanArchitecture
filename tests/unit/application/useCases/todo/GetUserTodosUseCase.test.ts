import { GetUserTodosUseCase } from '../../../../../src/application/useCases/todo/GetUserTodosUseCase';
import { TodoRepository } from '../../../../../src/application/ports/repositories/TodoRepository';
import { Todo } from '../../../../../src/domain/entities/Todo';
import { UserId } from '../../../../../src/domain/valueObjects/UserId';
import { Priority, PriorityValue } from '../../../../../src/domain/valueObjects/Priority';
import { Status, StatusValue } from '../../../../../src/domain/valueObjects/Status';

describe('GetUserTodosUseCase', () => {
  let getUserTodosUseCase: GetUserTodosUseCase;
  let mockTodoRepository: jest.Mocked<TodoRepository>;
  let mockTodos: Todo[];
  let userId: UserId;

  beforeEach(() => {
    userId = UserId.create();
    
    mockTodos = [
      Todo.create({
        userId,
        title: 'Test Todo 1',
        description: 'Test Description 1',
        dueDate: new Date('2025-12-31'),
        priority: Priority.fromValue(PriorityValue.HIGH),
        status: Status.fromValue(StatusValue.TODO)
      }),
      Todo.create({
        userId,
        title: 'Test Todo 2',
        description: 'Test Description 2',
        dueDate: new Date('2025-11-30'),
        priority: Priority.fromValue(PriorityValue.MEDIUM),
        status: Status.fromValue(StatusValue.IN_PROGRESS)
      })
    ];

    mockTodoRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    };

    getUserTodosUseCase = new GetUserTodosUseCase(mockTodoRepository);
  });

  it('should get all todos for a user and return DTOs', async () => {
    mockTodoRepository.findByUserId.mockResolvedValue(mockTodos);

    const result = await getUserTodosUseCase.execute(userId.getValue());

    expect(mockTodoRepository.findByUserId).toHaveBeenCalledWith(expect.any(UserId));
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(expect.objectContaining({
      title: 'Test Todo 1',
      description: 'Test Description 1',
      priority: 'HIGH',
      status: 'TODO'
    }));
    expect(result[1]).toEqual(expect.objectContaining({
      title: 'Test Todo 2',
      description: 'Test Description 2',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS'
    }));
  });

  it('should return an empty array if no todos are found', async () => {
    mockTodoRepository.findByUserId.mockResolvedValue([]);

    const result = await getUserTodosUseCase.execute(userId.getValue());

    expect(mockTodoRepository.findByUserId).toHaveBeenCalledWith(expect.any(UserId));
    expect(result).toHaveLength(0);
  });
});
