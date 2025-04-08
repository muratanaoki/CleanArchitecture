import * as bcrypt from 'bcrypt';

export class Password {
  private readonly value: string;
  private readonly isHashed: boolean;

  private constructor(password: string, isHashed: boolean) {
    if (!isHashed) {
      this.validate(password);
    }
    this.value = password;
    this.isHashed = isHashed;
  }

  public static create(password: string): Password {
    return new Password(password, false);
  }

  public static fromHashed(hashedPassword: string): Password {
    return new Password(hashedPassword, true);
  }

  private validate(password: string): void {
    if (!password || password.trim().length === 0) {
      throw new Error('Password cannot be empty');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public isAlreadyHashed(): boolean {
    return this.isHashed;
  }

  public async comparePassword(plainPassword: string): Promise<boolean> {
    if (!this.isHashed) {
      return this.value === plainPassword;
    }
    return bcrypt.compare(plainPassword, this.value);
  }

  public async getHashedValue(): Promise<string> {
    if (this.isHashed) {
      return this.value;
    }
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(this.value, salt);
  }
}
