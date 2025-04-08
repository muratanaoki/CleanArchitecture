export enum StatusValue {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export class Status {
  private readonly value: StatusValue;

  private constructor(status: StatusValue) {
    this.value = status;
  }

  public static create(status: string): Status {
    const upperStatus = status.toUpperCase();
    
    if (!Object.values(StatusValue).includes(upperStatus as StatusValue)) {
      throw new Error(`Invalid status value: ${status}. Valid values are: ${Object.values(StatusValue).join(', ')}`);
    }
    
    return new Status(upperStatus as StatusValue);
  }

  public static fromValue(status: StatusValue): Status {
    return new Status(status);
  }

  public static createDefault(): Status {
    return new Status(StatusValue.TODO);
  }

  public getValue(): StatusValue {
    return this.value;
  }

  public equals(status?: Status): boolean {
    if (!status) {
      return false;
    }
    return this.value === status.getValue();
  }

  public isDone(): boolean {
    return this.value === StatusValue.DONE;
  }

  public isInProgress(): boolean {
    return this.value === StatusValue.IN_PROGRESS;
  }

  public isTodo(): boolean {
    return this.value === StatusValue.TODO;
  }
}
