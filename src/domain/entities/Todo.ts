import { TodoId } from '../valueObjects/TodoId';
import { UserId } from '../valueObjects/UserId';
import { Priority, PriorityValue } from '../valueObjects/Priority';
import { Status, StatusValue } from '../valueObjects/Status';

export interface TodoProps {
  id: TodoId;
  userId: UserId;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export class Todo {
  private readonly id: TodoId;
  private readonly userId: UserId;
  private title: string;
  private description: string;
  private dueDate: Date;
  private priority: Priority;
  private status: Status;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(props: TodoProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.title = props.title;
    this.description = props.description;
    this.dueDate = props.dueDate;
    this.priority = props.priority;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: Omit<TodoProps, 'id' | 'createdAt' | 'updatedAt'>): Todo {
    this.validateTitle(props.title);
    
    const now = new Date();
    
    return new Todo({
      ...props,
      id: TodoId.create(),
      createdAt: now,
      updatedAt: now
    });
  }

  public static reconstitute(props: TodoProps): Todo {
    return new Todo(props);
  }

  private static validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Todo title cannot be empty');
    }
    
    if (title.length > 100) {
      throw new Error('Todo title cannot be longer than 100 characters');
    }
  }

  public getId(): TodoId {
    return this.id;
  }

  public getUserId(): UserId {
    return this.userId;
  }

  public getTitle(): string {
    return this.title;
  }

  public getDescription(): string {
    return this.description;
  }

  public getDueDate(): Date {
    return this.dueDate;
  }

  public getPriority(): Priority {
    return this.priority;
  }

  public getStatus(): Status {
    return this.status;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public updateTitle(title: string): void {
    Todo.validateTitle(title);
    this.title = title;
    this.updatedAt = new Date();
  }

  public updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  public updateDueDate(dueDate: Date): void {
    this.dueDate = dueDate;
    this.updatedAt = new Date();
  }

  public updatePriority(priority: Priority): void {
    this.priority = priority;
    this.updatedAt = new Date();
  }

  public markAsInProgress(): void {
    if (this.status.isDone()) {
      throw new Error('Cannot mark a completed todo as in progress');
    }
    this.status = Status.fromValue(StatusValue.IN_PROGRESS);
    this.updatedAt = new Date();
  }

  public markAsDone(): void {
    this.status = Status.fromValue(StatusValue.DONE);
    this.updatedAt = new Date();
  }

  public markAsTodo(): void {
    this.status = Status.fromValue(StatusValue.TODO);
    this.updatedAt = new Date();
  }

  public isOverdue(): boolean {
    return this.dueDate < new Date() && !this.status.isDone();
  }

  public toObject(): TodoProps {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
