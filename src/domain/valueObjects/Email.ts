export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.validate(email);
    this.value = email.toLowerCase();
  }

  public static create(email: string): Email {
    return new Email(email);
  }

  private validate(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(email?: Email): boolean {
    if (!email) {
      return false;
    }
    return this.value === email.getValue();
  }
}
