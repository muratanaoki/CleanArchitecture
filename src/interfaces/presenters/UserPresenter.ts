import { Service } from 'typedi';
import { UserDTO } from '../../application/dtos/UserDTO';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

@Service()
export class UserPresenter {
  public toResponse(dto: UserDTO): UserResponse {
    return {
      ...dto
    };
  }

  public toResponseList(dtos: UserDTO[]): UserResponse[] {
    return dtos.map(dto => this.toResponse(dto));
  }
}
