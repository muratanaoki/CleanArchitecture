import { DeleteTodoUseCase } from '../../../../../src/application/useCases/todo/DeleteTodoUseCase';
import { TodoRepository } from '../../../../../src/application/ports/repositories/TodoRepository';
import { Todo } from '../../../../../src/domain/entities/Todo';
import { TodoId } from '../../../../../src/domain/valueObjects/TodoId';
import { UserId } from '../../../../../src/domain/valueObjects/UserId';
import { Priority, PriorityValue } from '../../../../../src/domain/valueObjects/Priority';
import { Status, StatusValue } from '../../../../../src/domain/valueObjects/Status';

describe('DeleteTodoUseCase', () => {
  let deleteTodoUseCase: DeleteTodoUseCase;
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

    deleteTodoUseCase = new DeleteTodoUseCase(mockTodoRepository);
  });

  it('should delete a todo', async () => {
    mockTodoRepository.findById.mockResolvedValue(mockTodo);

    await deleteTodoUseCase.execute(todoId.getValue());

    expect(mockTodoRepository.findById).toHaveBeenCalledWith(expect.any(TodoId));
    expect(mockTodoRepository.delete).toHaveBeenCalledWith(expect.any(TodoId));
  });

  it('should throw an error if todo is not found', async () => {
    mockTodoRepository.findById.mockResolvedValue(null);

    await expect(deleteTodoUseCase.execute(todoId.getValue())).rejects.toThrow(`Todo with id ${todoId.getValue()} not found`);
    expect(mockTodoRepository.delete).not.toHaveBeenCalled();
  });
});
