import { UserId } from '../valueObjects/UserId';
import { Email } from '../valueObjects/Email';
import { Password } from '../valueObjects/Password';
import { Role, RoleValue } from '../valueObjects/Role';

export interface UserProps {
  id: UserId;
  name: string;
  email: Email;
  password: Password;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private readonly id: UserId;
  private name: string;
  private email: Email;
  private password: Password;
  private role: Role;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: Omit<UserProps, 'id' | 'role' | 'createdAt' | 'updatedAt'>): User {
    this.validateName(props.name);
    
    const now = new Date();
    
    return new User({
      ...props,
      id: UserId.create(),
      role: Role.createDefault(),
      createdAt: now,
      updatedAt: now
    });
  }

  public static reconstitute(props: UserProps): User {
    return new User(props);
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('User name cannot be empty');
    }
    
    if (name.length > 50) {
      throw new Error('User name cannot be longer than 50 characters');
    }
  }

  public getId(): UserId {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getPassword(): Password {
    return this.password;
  }

  public getRole(): Role {
    return this.role;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public updateName(name: string): void {
    User.validateName(name);
    this.name = name;
    this.updatedAt = new Date();
  }

  public updateEmail(email: Email): void {
    this.email = email;
    this.updatedAt = new Date();
  }

  public async updatePassword(password: Password): Promise<void> {
    this.password = Password.fromHashed(await password.getHashedValue());
    this.updatedAt = new Date();
  }

  public promoteToAdmin(): void {
    if (this.role.isAdmin()) {
      throw new Error('User is already an admin');
    }
    this.role = Role.fromValue(RoleValue.ADMIN);
    this.updatedAt = new Date();
  }

  public demoteToUser(): void {
    if (this.role.isUser()) {
      throw new Error('User is already a regular user');
    }
    this.role = Role.fromValue(RoleValue.USER);
    this.updatedAt = new Date();
  }

  public async validatePassword(plainPassword: string): Promise<boolean> {
    return this.password.comparePassword(plainPassword);
  }

  public isAdmin(): boolean {
    return this.role.isAdmin();
  }

  public toObject(): Omit<UserProps, 'password'> & { password: string } {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password.getValue(),
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
