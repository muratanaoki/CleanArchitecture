export enum PriorityValue {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export class Priority {
  private readonly value: PriorityValue;

  private constructor(priority: PriorityValue) {
    this.value = priority;
  }

  public static create(priority: string): Priority {
    const upperPriority = priority.toUpperCase();
    
    if (!Object.values(PriorityValue).includes(upperPriority as PriorityValue)) {
      throw new Error(`Invalid priority value: ${priority}. Valid values are: ${Object.values(PriorityValue).join(', ')}`);
    }
    
    return new Priority(upperPriority as PriorityValue);
  }

  public static fromValue(priority: PriorityValue): Priority {
    return new Priority(priority);
  }

  public getValue(): PriorityValue {
    return this.value;
  }

  public equals(priority?: Priority): boolean {
    if (!priority) {
      return false;
    }
    return this.value === priority.getValue();
  }

  public isHigherThan(priority: Priority): boolean {
    const priorityOrder = {
      [PriorityValue.LOW]: 1,
      [PriorityValue.MEDIUM]: 2,
      [PriorityValue.HIGH]: 3
    };

    return priorityOrder[this.value] > priorityOrder[priority.getValue()];
  }
}
