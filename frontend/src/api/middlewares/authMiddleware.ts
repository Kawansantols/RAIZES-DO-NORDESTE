import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../shared/errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'raizes_nordeste_secret_2026';

export interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload;
    }
  }
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token não fornecido.', 401, 'NAO_AUTENTICADO');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.usuario = payload;
    next();
  } catch {
    throw new AppError('Token inválido ou expirado.', 401, 'TOKEN_INVALIDO');
  }
}

export function autorizar(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      throw new AppError('Não autenticado.', 401, 'NAO_AUTENTICADO');
    }

    if (!roles.includes(req.usuario.role)) {
      throw new AppError('Acesso negado.', 403, 'SEM_PERMISSAO');
    }

    next();
  };
}