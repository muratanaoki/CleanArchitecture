import { User } from '../../../domain/entities/User';
import { UserId } from '../../../domain/valueObjects/UserId';

export interface TokenPayload {
  userId: string;
  role: string;
}

export interface AuthService {
  generateToken(user: User): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload>;
  getUserIdFromToken(token: string): Promise<UserId>;
}
