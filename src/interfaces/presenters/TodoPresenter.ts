import { Service } from 'typedi';
import { TodoDTO } from '../../application/dtos/TodoDTO';

export interface TodoResponse {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
}

@Service()
export class TodoPresenter {
  public toResponse(dto: TodoDTO): TodoResponse {
    const dueDate = new Date(dto.dueDate);
    const isOverdue = dueDate < new Date() && dto.status !== 'DONE';

    return {
      ...dto,
      isOverdue
    };
  }

  public toResponseList(dtos: TodoDTO[]): TodoResponse[] {
    return dtos.map(dto => this.toResponse(dto));
  }
}
