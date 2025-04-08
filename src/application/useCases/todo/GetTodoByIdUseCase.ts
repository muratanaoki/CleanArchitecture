import { Service } from 'typedi';
import { TodoId } from '../../../domain/valueObjects/TodoId';
import { TodoRepository } from '../../ports/repositories/TodoRepository';
import { TodoDTO, TodoMapper } from '../../dtos/TodoDTO';

@Service()
export class GetTodoByIdUseCase {
  constructor(private todoRepository: TodoRepository) {}

  public async execute(id: string): Promise<TodoDTO> {
    const todoId = TodoId.fromString(id);
    const todo = await this.todoRepository.findById(todoId);

    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    return TodoMapper.toDTO(todo);
  }
}
