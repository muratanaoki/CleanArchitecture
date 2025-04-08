import { Service } from 'typedi';
import { TodoId } from '../../../domain/valueObjects/TodoId';
import { TodoRepository } from '../../ports/repositories/TodoRepository';

@Service()
export class DeleteTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  public async execute(id: string): Promise<void> {
    const todoId = TodoId.fromString(id);
    const todo = await this.todoRepository.findById(todoId);

    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    await this.todoRepository.delete(todoId);
  }
}
