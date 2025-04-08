import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { CreateTodoUseCase } from '../../application/useCases/todo/CreateTodoUseCase';
import { GetTodoByIdUseCase } from '../../application/useCases/todo/GetTodoByIdUseCase';
import { GetUserTodosUseCase } from '../../application/useCases/todo/GetUserTodosUseCase';
import { UpdateTodoUseCase } from '../../application/useCases/todo/UpdateTodoUseCase';
import { DeleteTodoUseCase } from '../../application/useCases/todo/DeleteTodoUseCase';
import { CreateTodoDTO, UpdateTodoDTO } from '../../application/dtos/TodoDTO';
import { UserId } from '../../domain/valueObjects/UserId';

@Service()
export class TodoController {
  constructor(
    private createTodoUseCase: CreateTodoUseCase,
    private getTodoByIdUseCase: GetTodoByIdUseCase,
    private getUserTodosUseCase: GetUserTodosUseCase,
    private updateTodoUseCase: UpdateTodoUseCase,
    private deleteTodoUseCase: DeleteTodoUseCase
  ) {}

  public async createTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const dto: CreateTodoDTO = {
        userId,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority
      };

      const result = await this.createTodoUseCase.execute(dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async getTodoById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const todoId = req.params.id;
      const todo = await this.getTodoByIdUseCase.execute(todoId);
      
      if (todo.userId !== userId && !req.user?.isAdmin) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }
      
      res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  }

  public async getUserTodos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const todos = await this.getUserTodosUseCase.execute(userId);
      res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  }

  public async updateTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const todoId = req.params.id;
      
      const todo = await this.getTodoByIdUseCase.execute(todoId);
      
      if (todo.userId !== userId && !req.user?.isAdmin) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const dto: UpdateTodoDTO = {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        status: req.body.status
      };

      const result = await this.updateTodoUseCase.execute(todoId, dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async deleteTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const todoId = req.params.id;
      
      const todo = await this.getTodoByIdUseCase.execute(todoId);
      
      if (todo.userId !== userId && !req.user?.isAdmin) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      await this.deleteTodoUseCase.execute(todoId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
