import { Service } from 'typedi';
import * as jwt from 'jsonwebtoken';
import { User } from '../../domain/entities/User';
import { UserId } from '../../domain/valueObjects/UserId';
import { AuthService, TokenPayload } from '../../application/ports/services/AuthService';
import { config } from '../config';

@Service()
export class JwtAuthService implements AuthService {
  public async generateToken(user: User): Promise<string> {
    const payload: TokenPayload = {
      userId: user.getId().getValue(),
      role: user.getRole().getValue()
    };

    return jwt.sign(
      payload, 
      config.jwt.secret as string, 
      {
        expiresIn: config.jwt.expiresIn
      }
    );
  }

  public async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const payload = jwt.verify(token, config.jwt.secret as string) as TokenPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  public async getUserIdFromToken(token: string): Promise<UserId> {
    const payload = await this.verifyToken(token);
    return UserId.fromString(payload.userId);
  }
}
