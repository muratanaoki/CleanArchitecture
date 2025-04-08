import { CreateTodoUseCase } from '../../../../../src/application/useCases/todo/CreateTodoUseCase';
import { TodoRepository } from '../../../../../src/application/ports/repositories/TodoRepository';
import { Todo } from '../../../../../src/domain/entities/Todo';
import { TodoId } from '../../../../../src/domain/valueObjects/TodoId';
import { UserId } from '../../../../../src/domain/valueObjects/UserId';
import { CreateTodoDTO } from '../../../../../src/application/dtos/TodoDTO';

describe('CreateTodoUseCase', () => {
  let createTodoUseCase: CreateTodoUseCase;
  let mockTodoRepository: jest.Mocked<TodoRepository>;

  beforeEach(() => {
    mockTodoRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    };

    createTodoUseCase = new CreateTodoUseCase(mockTodoRepository);
  });

  it('should create a todo and return a DTO', async () => {
    const userId = UserId.create();
    const createTodoDTO: CreateTodoDTO = {
      userId: userId.getValue(),
      title: 'Test Todo',
      description: 'Test Description',
      dueDate: '2025-12-31T00:00:00.000Z',
      priority: 'MEDIUM'
    };

    const result = await createTodoUseCase.execute(createTodoDTO);

    expect(mockTodoRepository.save).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({
      userId: userId.getValue(),
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'MEDIUM',
      status: 'TODO'
    }));
  });

  it('should throw an error if title is empty', async () => {
    const userId = UserId.create();
    const createTodoDTO: CreateTodoDTO = {
      userId: userId.getValue(),
      title: '',
      description: 'Test Description',
      dueDate: '2025-12-31T00:00:00.000Z',
      priority: 'MEDIUM'
    };

    await expect(createTodoUseCase.execute(createTodoDTO)).rejects.toThrow('Todo title cannot be empty');
    expect(mockTodoRepository.save).not.toHaveBeenCalled();
  });
});
