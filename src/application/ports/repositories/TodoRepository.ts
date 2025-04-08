import { Todo } from '../../../domain/entities/Todo';
import { TodoId } from '../../../domain/valueObjects/TodoId';
import { UserId } from '../../../domain/valueObjects/UserId';

export interface TodoRepository {
  findById(id: TodoId): Promise<Todo | null>;
  findByUserId(userId: UserId): Promise<Todo[]>;
  save(todo: Todo): Promise<void>;
  delete(id: TodoId): Promise<void>;
}
