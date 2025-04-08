import { Router } from 'express';
import { Container } from 'typedi';
import { UserController } from '../../../interfaces/controllers/UserController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const userController = Container.get(UserController);

router.post('/', (req, res, next) => userController.createUser(req, res, next));

router.use(authMiddleware);
router.get('/:id', (req, res, next) => userController.getUserById(req, res, next));
router.put('/:id', (req, res, next) => userController.updateUser(req, res, next));
router.delete('/:id', (req, res, next) => userController.deleteUser(req, res, next));

export default router;
