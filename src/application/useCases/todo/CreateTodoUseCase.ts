import { Service } from 'typedi';
import { Todo } from '../../../domain/entities/Todo';
import { UserId } from '../../../domain/valueObjects/UserId';
import { Priority } from '../../../domain/valueObjects/Priority';
import { Status } from '../../../domain/valueObjects/Status';
import { TodoRepository } from '../../ports/repositories/TodoRepository';
import { CreateTodoDTO } from '../../dtos/TodoDTO';
import { TodoDTO, TodoMapper } from '../../dtos/TodoDTO';

@Service()
export class CreateTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  public async execute(dto: CreateTodoDTO): Promise<TodoDTO> {
    const todo = Todo.create({
      userId: UserId.fromString(dto.userId),
      title: dto.title,
      description: dto.description,
      dueDate: new Date(dto.dueDate),
      priority: Priority.create(dto.priority),
      status: Status.createDefault()
    });

    await this.todoRepository.save(todo);

    return TodoMapper.toDTO(todo);
  }
}
