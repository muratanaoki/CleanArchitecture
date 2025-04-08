import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController } from '../../../interfaces/controllers/AuthController';

const router = Router();
const authController = Container.get(AuthController);

router.post('/login', (req, res, next) => authController.login(req, res, next));

export default router;
