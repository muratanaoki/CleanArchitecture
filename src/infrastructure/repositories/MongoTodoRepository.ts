import { Service } from 'typedi';
import { Collection } from 'mongodb';
import { Todo } from '../../domain/entities/Todo';
import { TodoId } from '../../domain/valueObjects/TodoId';
import { UserId } from '../../domain/valueObjects/UserId';
import { Priority } from '../../domain/valueObjects/Priority';
import { Status } from '../../domain/valueObjects/Status';
import { TodoRepository } from '../../application/ports/repositories/TodoRepository';
import { MongoDBConnection } from '../database/mongodb/connection';

interface TodoDocument {
  _id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Service()
export class MongoTodoRepository implements TodoRepository {
  private collection: Collection<TodoDocument>;

  constructor() {
    const db = MongoDBConnection.getInstance().getDb();
    this.collection = db.collection<TodoDocument>('todos');
  }

  public async findById(id: TodoId): Promise<Todo | null> {
    const document = await this.collection.findOne({ _id: id.getValue() });
    
    if (!document) {
      return null;
    }
    
    return this.mapToEntity(document);
  }

  public async findByUserId(userId: UserId): Promise<Todo[]> {
    const documents = await this.collection.find({ userId: userId.getValue() }).toArray();
    return documents.map(doc => this.mapToEntity(doc));
  }

  public async save(todo: Todo): Promise<void> {
    const document = this.mapToDocument(todo);
    
    await this.collection.updateOne(
      { _id: document._id },
      { $set: document },
      { upsert: true }
    );
  }

  public async delete(id: TodoId): Promise<void> {
    await this.collection.deleteOne({ _id: id.getValue() });
  }

  private mapToEntity(document: TodoDocument): Todo {
    return Todo.reconstitute({
      id: TodoId.fromString(document._id),
      userId: UserId.fromString(document.userId),
      title: document.title,
      description: document.description,
      dueDate: document.dueDate,
      priority: Priority.create(document.priority),
      status: Status.create(document.status),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    });
  }

  private mapToDocument(todo: Todo): TodoDocument {
    return {
      _id: todo.getId().getValue(),
      userId: todo.getUserId().getValue(),
      title: todo.getTitle(),
      description: todo.getDescription(),
      dueDate: todo.getDueDate(),
      priority: todo.getPriority().getValue(),
      status: todo.getStatus().getValue(),
      createdAt: todo.getCreatedAt(),
      updatedAt: todo.getUpdatedAt()
    };
  }
}
