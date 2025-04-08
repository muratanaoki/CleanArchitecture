import { UpdateTodoUseCase } from '../../../../../src/application/useCases/todo/UpdateTodoUseCase';
import { TodoRepository } from '../../../../../src/application/ports/repositories/TodoRepository';
import { Todo } from '../../../../../src/domain/entities/Todo';
import { TodoId } from '../../../../../src/domain/valueObjects/TodoId';
import { UserId } from '../../../../../src/domain/valueObjects/UserId';
import { Priority, PriorityValue } from '../../../../../src/domain/valueObjects/Priority';
import { Status, StatusValue } from '../../../../../src/domain/valueObjects/Status';
import { UpdateTodoDTO } from '../../../../../src/application/dtos/TodoDTO';

describe('UpdateTodoUseCase', () => {
  let updateTodoUseCase: UpdateTodoUseCase;
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

    updateTodoUseCase = new UpdateTodoUseCase(mockTodoRepository);
  });

  it('should update a todo and return a DTO', async () => {
    mockTodoRepository.findById.mockResolvedValue(mockTodo);

    const updateTodoDTO: UpdateTodoDTO = {
      title: 'Updated Title',
      description: 'Updated Description',
      priority: 'HIGH',
      status: 'IN_PROGRESS'
    };

    const result = await updateTodoUseCase.execute(todoId.getValue(), updateTodoDTO);

    expect(mockTodoRepository.findById).toHaveBeenCalledWith(expect.any(TodoId));
    expect(mockTodoRepository.save).toHaveBeenCalledWith(mockTodo);
    expect(result).toEqual(expect.objectContaining({
      id: todoId.getValue(),
      title: 'Updated Title',
      description: 'Updated Description',
      priority: 'HIGH',
      status: 'IN_PROGRESS'
    }));
  });

  it('should throw an error if todo is not found', async () => {
    mockTodoRepository.findById.mockResolvedValue(null);

    const updateTodoDTO: UpdateTodoDTO = {
      title: 'Updated Title'
    };

    await expect(updateTodoUseCase.execute(todoId.getValue(), updateTodoDTO)).rejects.toThrow(`Todo with id ${todoId.getValue()} not found`);
    expect(mockTodoRepository.save).not.toHaveBeenCalled();
  });

  it('should only update the provided fields', async () => {
    mockTodoRepository.findById.mockResolvedValue(mockTodo);

    const updateTodoDTO: UpdateTodoDTO = {
      title: 'Updated Title'
    };

    const result = await updateTodoUseCase.execute(todoId.getValue(), updateTodoDTO);

    expect(result).toEqual(expect.objectContaining({
      id: todoId.getValue(),
      title: 'Updated Title',
      description: 'Test Description', // unchanged
      priority: 'MEDIUM', // unchanged
      status: 'TODO' // unchanged
    }));
  });
});
