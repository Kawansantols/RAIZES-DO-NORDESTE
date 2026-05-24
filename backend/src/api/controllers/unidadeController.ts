import { Request, Response, NextFunction } from 'express';
import { unidadeService } from '../../application/services/unidadeService';

export const unidadeController = {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const unidades = await unidadeService.listar();
      res.status(200).json(unidades);
    } catch (error) {
      next(error);
    }
  },

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const unidade = await unidadeService.buscarPorId(Number(id));
      res.status(200).json(unidade);
    } catch (error) {
      next(error);
    }
  },

  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, cidade, estado } = req.body;
      const unidade = await unidadeService.criar({ nome, cidade, estado });
      res.status(201).json(unidade);
    } catch (error) {
      next(error);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const unidade = await unidadeService.atualizar(Number(id), req.body);
      res.status(200).json(unidade);
    } catch (error) {
      next(error);
    }
  },
};