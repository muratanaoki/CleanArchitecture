import { User } from '../../../domain/entities/User';
import { UserId } from '../../../domain/valueObjects/UserId';
import { Email } from '../../../domain/valueObjects/Email';

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
