import { Request, Response, NextFunction } from 'express';
import { fidelidadeService } from '../../application/services/fidelidadeService';

export const fidelidadeController = {
  async consultar(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = req.usuario!.id;
      const fidelidade = await fidelidadeService.consultar(usuarioId);
      res.status(200).json(fidelidade);
    } catch (error) {
      next(error);
    }
  },

  async adicionarPontos(req: Request, res: Response, next: NextFunction) {
    try {
      const { usuarioId, pontos } = req.body;
      const fidelidade = await fidelidadeService.adicionarPontos(usuarioId, pontos);
      res.status(200).json(fidelidade);
    } catch (error) {
      next(error);
    }
  },

  async resgatar(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = req.usuario!.id;
      const { pontos } = req.body;
      const fidelidade = await fidelidadeService.resgatar(usuarioId, pontos);
      res.status(200).json(fidelidade);
    } catch (error) {
      next(error);
    }
  },
};