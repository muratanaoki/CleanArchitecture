import { Service } from 'typedi';
import { TodoId } from '../../../domain/valueObjects/TodoId';
import { Priority } from '../../../domain/valueObjects/Priority';
import { Status } from '../../../domain/valueObjects/Status';
import { TodoRepository } from '../../ports/repositories/TodoRepository';
import { UpdateTodoDTO } from '../../dtos/TodoDTO';
import { TodoDTO, TodoMapper } from '../../dtos/TodoDTO';

@Service()
export class UpdateTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  public async execute(id: string, dto: UpdateTodoDTO): Promise<TodoDTO> {
    const todoId = TodoId.fromString(id);
    const todo = await this.todoRepository.findById(todoId);

    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    if (dto.title) {
      todo.updateTitle(dto.title);
    }

    if (dto.description !== undefined) {
      todo.updateDescription(dto.description);
    }

    if (dto.dueDate) {
      todo.updateDueDate(new Date(dto.dueDate));
    }

    if (dto.priority) {
      todo.updatePriority(Priority.create(dto.priority));
    }

    if (dto.status) {
      const status = Status.create(dto.status);
      
      if (status.isDone()) {
        todo.markAsDone();
      } else if (status.isInProgress()) {
        todo.markAsInProgress();
      } else {
        todo.markAsTodo();
      }
    }

    await this.todoRepository.save(todo);

    return TodoMapper.toDTO(todo);
  }
}
