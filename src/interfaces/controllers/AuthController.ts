import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../application/useCases/auth/LoginUseCase';
import { LoginUserDTO } from '../../application/dtos/UserDTO';

@Service()
export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginUserDTO = {
        email: req.body.email,
        password: req.body.password
      };

      const result = await this.loginUseCase.execute(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
