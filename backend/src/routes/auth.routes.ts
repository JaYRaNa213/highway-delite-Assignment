import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller';

const router = Router();

// POST /auth/signup - Register user with email and password
router.post('/signup', signup);

// POST /auth/login - Login with email and password
router.post('/login', login);

export default router;
