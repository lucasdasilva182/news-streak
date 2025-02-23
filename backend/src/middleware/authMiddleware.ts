import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token inválido ou expirado.' });
    }

    req.body.user = user;
    next();
  });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.body.user;

  if (user.is_admin !== 1) {
    return res.status(403).json({ success: false, message: 'Acesso negado.' });
  }

  next();
};
