import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization as string | undefined;
  if (!auth) return res.status(401).json({ message: 'Missing token' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    (req as any).user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (role: 'admin' | 'user') => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (!(req as any).user) return res.status(401).json({ message: 'Missing token' });
    if ((req as any).user.role !== role && role === 'admin') return res.status(403).json({ message: 'Forbidden' });
    return next();
  };
};
