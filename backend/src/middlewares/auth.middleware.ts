import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    name: string;
    signupMethod: 'email' | 'google'; // ✅ expanded
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
      return;
    }

    const decoded = verifyToken(token);
    
    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }

    // Add user info to request (with fallback for old records)
    req.user = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      signupMethod: user.signupMethod ?? 'email', // ✅ fallback avoids undefined
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};
