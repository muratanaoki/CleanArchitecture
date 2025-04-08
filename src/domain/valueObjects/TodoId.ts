import { v4 as uuidv4 } from 'uuid';

export class TodoId {
  private readonly value: string;

  private constructor(id: string) {
    this.validate(id);
    this.value = id;
  }

  public static create(): TodoId {
    return new TodoId(uuidv4());
  }

  public static fromString(id: string): TodoId {
    return new TodoId(id);
  }

  private validate(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('TodoId cannot be empty');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(id?: TodoId): boolean {
    if (!id) {
      return false;
    }
    return this.value === id.getValue();
  }
}
