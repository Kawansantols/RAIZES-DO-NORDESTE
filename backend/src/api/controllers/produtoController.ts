import { Request, Response, NextFunction } from 'express';
import { produtoService } from '../../application/services/produtoService';

export const produtoController = {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { unidadeId } = req.params;
      const produtos = await produtoService.listar(Number(unidadeId));
      res.status(200).json(produtos);
    } catch (error) {
      next(error);
    }
  },

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const produto = await produtoService.buscarPorId(Number(id));
      res.status(200).json(produto);
    } catch (error) {
      next(error);
    }
  },

  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, descricao, preco, unidadeId } = req.body;
      const produto = await produtoService.criar({ nome, descricao, preco, unidadeId });
      res.status(201).json(produto);
    } catch (error) {
      next(error);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const produto = await produtoService.atualizar(Number(id), req.body);
      res.status(200).json(produto);
    } catch (error) {
      next(error);
    }
  },
};