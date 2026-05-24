import prisma from '../database/prismaClient';
import { StatusPagamento } from '@prisma/client';

export const pagamentoRepository = {
  async create(data: { pedidoId: number; valor: number }) {
    return prisma.pagamento.create({
      data: {
        pedidoId: data.pedidoId,
        valor: data.valor,
        status: 'PENDENTE',
      },
    });
  },

  async findByPedido(pedidoId: number) {
    return prisma.pagamento.findUnique({ where: { pedidoId } });
  },

  async updateStatus(pedidoId: number, status: StatusPagamento, payload?: string) {
    return prisma.pagamento.update({
      where: { pedidoId },
      data: { status, payload },
    });
  },
};