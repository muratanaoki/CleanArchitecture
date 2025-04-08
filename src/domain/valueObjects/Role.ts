export enum RoleValue {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export class Role {
  private readonly value: RoleValue;

  private constructor(role: RoleValue) {
    this.value = role;
  }

  public static create(role: string): Role {
    const upperRole = role.toUpperCase();
    
    if (!Object.values(RoleValue).includes(upperRole as RoleValue)) {
      throw new Error(`Invalid role value: ${role}. Valid values are: ${Object.values(RoleValue).join(', ')}`);
    }
    
    return new Role(upperRole as RoleValue);
  }

  public static fromValue(role: RoleValue): Role {
    return new Role(role);
  }

  public static createDefault(): Role {
    return new Role(RoleValue.USER);
  }

  public getValue(): RoleValue {
    return this.value;
  }

  public equals(role?: Role): boolean {
    if (!role) {
      return false;
    }
    return this.value === role.getValue();
  }

  public isAdmin(): boolean {
    return this.value === RoleValue.ADMIN;
  }

  public isUser(): boolean {
    return this.value === RoleValue.USER;
  }
}
