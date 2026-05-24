import { Request, Response, NextFunction } from 'express';
import { pagamentoService } from '../../application/services/pagamentoService';

export const pagamentoController = {
  async processar(req: Request, res: Response, next: NextFunction) {
    try {
      const { pedidoId } = req.params;
      const resultado = await pagamentoService.processar(Number(pedidoId));
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  },

  async consultar(req: Request, res: Response, next: NextFunction) {
    try {
      const { pedidoId } = req.params;
      const pagamento = await pagamentoService.consultar(Number(pedidoId));
      res.status(200).json(pagamento);
    } catch (error) {
      next(error);
    }
  },
};