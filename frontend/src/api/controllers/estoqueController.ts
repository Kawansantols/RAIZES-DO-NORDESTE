import { Request, Response, NextFunction } from 'express';
import { estoqueService } from '../../application/services/estoqueService';

export const estoqueController = {
  async consultarPorUnidade(req: Request, res: Response, next: NextFunction) {
    try {
      const { unidadeId } = req.params;
      const estoque = await estoqueService.consultarPorUnidade(Number(unidadeId));
      res.status(200).json(estoque);
    } catch (error) {
      next(error);
    }
  },

  async consultarPorProduto(req: Request, res: Response, next: NextFunction) {
    try {
      const { produtoId } = req.params;
      const estoque = await estoqueService.consultarPorProduto(Number(produtoId));
      res.status(200).json(estoque);
    } catch (error) {
      next(error);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { produtoId } = req.params;
      const { quantidade } = req.body;
      const estoque = await estoqueService.atualizar(Number(produtoId), quantidade);
      res.status(200).json(estoque);
    } catch (error) {
      next(error);
    }
  },
};