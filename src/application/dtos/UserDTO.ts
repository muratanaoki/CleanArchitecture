import { UserId } from '../../domain/valueObjects/UserId';
import { Email } from '../../domain/valueObjects/Email';
import { Password } from '../../domain/valueObjects/Password';
import { Role, RoleValue } from '../../domain/valueObjects/Role';
import { User } from '../../domain/entities/User';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: RoleValue;
  createdAt: string;
  updatedAt: string;
}

export class UserMapper {
  public static toDTO(user: User): UserDTO {
    return {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      role: user.getRole().getValue(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString()
    };
  }

  public static toDomain(dto: UserDTO, hashedPassword: string): User {
    return User.reconstitute({
      id: UserId.fromString(dto.id),
      name: dto.name,
      email: Email.create(dto.email),
      password: Password.fromHashed(hashedPassword),
      role: Role.fromValue(dto.role),
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt)
    });
  }
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
  role: RoleValue;
  token: string;
}
