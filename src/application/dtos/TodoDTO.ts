import { TodoId } from '../../domain/valueObjects/TodoId';
import { UserId } from '../../domain/valueObjects/UserId';
import { Priority, PriorityValue } from '../../domain/valueObjects/Priority';
import { Status, StatusValue } from '../../domain/valueObjects/Status';
import { Todo } from '../../domain/entities/Todo';

export interface TodoDTO {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: PriorityValue;
  status: StatusValue;
  createdAt: string;
  updatedAt: string;
}

export class TodoMapper {
  public static toDTO(todo: Todo): TodoDTO {
    return {
      id: todo.getId().getValue(),
      userId: todo.getUserId().getValue(),
      title: todo.getTitle(),
      description: todo.getDescription(),
      dueDate: todo.getDueDate().toISOString(),
      priority: todo.getPriority().getValue(),
      status: todo.getStatus().getValue(),
      createdAt: todo.getCreatedAt().toISOString(),
      updatedAt: todo.getUpdatedAt().toISOString()
    };
  }

  public static toDomain(dto: TodoDTO): Todo {
    return Todo.reconstitute({
      id: TodoId.fromString(dto.id),
      userId: UserId.fromString(dto.userId),
      title: dto.title,
      description: dto.description,
      dueDate: new Date(dto.dueDate),
      priority: Priority.fromValue(dto.priority),
      status: Status.fromValue(dto.status),
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt)
    });
  }
}

export interface CreateTodoDTO {
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
}

export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
}
