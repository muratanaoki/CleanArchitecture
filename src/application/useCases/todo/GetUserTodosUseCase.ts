import { Service } from 'typedi';
import { UserId } from '../../../domain/valueObjects/UserId';
import { TodoRepository } from '../../ports/repositories/TodoRepository';
import { TodoDTO, TodoMapper } from '../../dtos/TodoDTO';

@Service()
export class GetUserTodosUseCase {
  constructor(private todoRepository: TodoRepository) {}

  public async execute(userId: string): Promise<TodoDTO[]> {
    const userIdObj = UserId.fromString(userId);
    const todos = await this.todoRepository.findByUserId(userIdObj);

    return todos.map(todo => TodoMapper.toDTO(todo));
  }
}
