import jwt, { Secret } from 'jsonwebtoken';

export const generateToken = (payload: object): string => {
  const secret: Secret | undefined = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set');

  return jwt.sign(payload, secret, {
    expiresIn:'7d',
  });
};

export const verifyToken = (token: string): any => {
  const secret: Secret | undefined = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set');

  return jwt.verify(token, secret);
};
