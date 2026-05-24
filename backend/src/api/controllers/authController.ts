import { Request, Response, NextFunction } from 'express';
import { authService } from '../../application/services/authService';
import { Role } from '@prisma/client';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, email, senha, role, consentimentoLGPD } = req.body;
      const usuario = await authService.register({
        nome,
        email,
        senha,
        role: role as Role,
        consentimentoLGPD,
      });
      res.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = req.body;
      const resultado = await authService.login(email, senha);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  },

  async perfil(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(req.usuario);
    } catch (error) {
      next(error);
    }
  },
};