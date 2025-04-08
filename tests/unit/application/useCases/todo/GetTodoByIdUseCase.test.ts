import { GetTodoByIdUseCase } from '../../../../../src/application/useCases/todo/GetTodoByIdUseCase';
import { TodoRepository } from '../../../../../src/application/ports/repositories/TodoRepository';
import { Todo } from '../../../../../src/domain/entities/Todo';
import { TodoId } from '../../../../../src/domain/valueObjects/TodoId';
import { UserId } from '../../../../../src/domain/valueObjects/UserId';
import { Priority, PriorityValue } from '../../../../../src/domain/valueObjects/Priority';
import { Status, StatusValue } from '../../../../../src/domain/valueObjects/Status';

describe('GetTodoByIdUseCase', () => {
  let getTodoByIdUseCase: GetTodoByIdUseCase;
  let mockTodoRepository: jest.Mocked<TodoRepository>;
  let mockTodo: Todo;
  let todoId: TodoId;

  beforeEach(() => {
    todoId = TodoId.create();
    const userId = UserId.create();
    
    mockTodo = Todo.create({
      userId,
      title: 'Test Todo',
      description: 'Test Description',
      dueDate: new Date('2025-12-31'),
      priority: Priority.fromValue(PriorityValue.MEDIUM),
      status: Status.fromValue(StatusValue.TODO)
    });

    mockTodoRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    };

    jest.spyOn(mockTodo, 'getId').mockReturnValue(todoId);

    getTodoByIdUseCase = new GetTodoByIdUseCase(mockTodoRepository);
  });

  it('should get a todo by id and return a DTO', async () => {
    mockTodoRepository.findById.mockResolvedValue(mockTodo);

    const result = await getTodoByIdUseCase.execute(todoId.getValue());

    expect(mockTodoRepository.findById).toHaveBeenCalledWith(expect.any(TodoId));
    expect(result).toEqual(expect.objectContaining({
      id: todoId.getValue(),
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'MEDIUM',
      status: 'TODO'
    }));
  });

  it('should throw an error if todo is not found', async () => {
    mockTodoRepository.findById.mockResolvedValue(null);

    await expect(getTodoByIdUseCase.execute(todoId.getValue())).rejects.toThrow(`Todo with id ${todoId.getValue()} not found`);
  });
});
