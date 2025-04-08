import { v4 as uuidv4 } from 'uuid';

export class UserId {
  private readonly value: string;

  private constructor(id: string) {
    this.validate(id);
    this.value = id;
  }

  public static create(): UserId {
    return new UserId(uuidv4());
  }

  public static fromString(id: string): UserId {
    return new UserId(id);
  }

  private validate(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('UserId cannot be empty');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(id?: UserId): boolean {
    if (!id) {
      return false;
    }
    return this.value === id.getValue();
  }
}
