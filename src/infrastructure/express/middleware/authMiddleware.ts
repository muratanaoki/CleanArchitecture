import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { JwtAuthService } from '../../auth/JwtAuthService';
import { UserRepository } from '../../../application/ports/repositories/UserRepository';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        isAdmin: boolean;
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'No authorization header provided' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    
    const authService = Container.get(JwtAuthService);
    const payload = await authService.verifyToken(token);
    
    req.user = {
      id: payload.userId,
      role: payload.role,
      isAdmin: payload.role === 'ADMIN'
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || !req.user.isAdmin) {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  
  next();
};
