import { Request, Response, NextFunction } from 'express';
import { pedidoService } from '../../application/services/pedidoService';
import { CanalPedido, StatusPedido } from '@prisma/client';

export const pedidoController = {
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const { unidadeId, canalPedido, itens } = req.body;
      const usuarioId = req.usuario!.id;

      const pedido = await pedidoService.criar({
        usuarioId,
        unidadeId,
        canalPedido: canalPedido as CanalPedido,
        itens,
      });

      res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  },

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pedido = await pedidoService.buscarPorId(Number(id));
      res.status(200).json(pedido);
    } catch (error) {
      next(error);
    }
  },

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { canalPedido, status } = req.query;
      const pedidos = await pedidoService.listar({
        canalPedido: canalPedido as CanalPedido,
        status: status as StatusPedido,
      });
      res.status(200).json(pedidos);
    } catch (error) {
      next(error);
    }
  },

  async atualizarStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const pedido = await pedidoService.atualizarStatus(Number(id), status as StatusPedido);
      res.status(200).json(pedido);
    } catch (error) {
      next(error);
    }
  },
};