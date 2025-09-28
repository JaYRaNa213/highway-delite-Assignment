import { Router } from 'express';
import { signup, verifyOTP, login, requestOTP } from '../controllers/auth.controller';

const router = Router();

// POST /auth/signup - Register user with email
router.post('/signup', signup);

// POST /auth/verify-otp - Verify OTP and complete registration
router.post('/verify-otp', verifyOTP);

// POST /auth/login - Login with email and OTP
router.post('/login', login);

// POST /auth/request-otp - Request new OTP
router.post('/request-otp', requestOTP);

export default router;
