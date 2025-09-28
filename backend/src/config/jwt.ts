import jwt, { SignOptions, Secret } from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  signupMethod: 'email' | 'google';
}

export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET as Secret | undefined;
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET as Secret | undefined;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.verify(token, secret) as JWTPayload;
};
