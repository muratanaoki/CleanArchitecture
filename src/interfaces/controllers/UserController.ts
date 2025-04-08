import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../application/useCases/user/CreateUserUseCase';
import { GetUserByIdUseCase } from '../../application/useCases/user/GetUserByIdUseCase';
import { UpdateUserUseCase } from '../../application/useCases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../application/useCases/user/DeleteUserUseCase';
import { CreateUserDTO, UpdateUserDTO } from '../../application/dtos/UserDTO';

@Service()
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateUserDTO = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };

      const result = await this.createUserUseCase.execute(dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      
      if (userId !== req.user?.id && !req.user?.isAdmin) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }
      
      const user = await this.getUserByIdUseCase.execute(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      
      if (userId !== req.user?.id && !req.user?.isAdmin) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const dto: UpdateUserDTO = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };

      const result = await this.updateUserUseCase.execute(userId, dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      
      if (userId !== req.user?.id && !req.user?.isAdmin) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      await this.deleteUserUseCase.execute(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
