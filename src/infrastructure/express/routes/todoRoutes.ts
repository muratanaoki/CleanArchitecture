import { Router } from 'express';
import { Container } from 'typedi';
import { TodoController } from '../../../interfaces/controllers/TodoController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const todoController = Container.get(TodoController);

router.use(authMiddleware);

router.post('/', (req, res, next) => todoController.createTodo(req, res, next));
router.get('/:id', (req, res, next) => todoController.getTodoById(req, res, next));
router.get('/', (req, res, next) => todoController.getUserTodos(req, res, next));
router.put('/:id', (req, res, next) => todoController.updateTodo(req, res, next));
router.delete('/:id', (req, res, next) => todoController.deleteTodo(req, res, next));

export default router;
