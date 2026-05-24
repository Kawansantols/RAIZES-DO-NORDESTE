import prisma from '../database/prismaClient';
import { CanalPedido, StatusPedido } from '@prisma/client';

export const pedidoRepository = {
  async create(data: {
    usuarioId: number;
    unidadeId: number;
    canalPedido: CanalPedido;
    total: number;
    itens: { produtoId: number; quantidade: number; precoUnitario: number }[];
  }) {
    return prisma.pedido.create({
      data: {
        usuarioId: data.usuarioId,
        unidadeId: data.unidadeId,
        canalPedido: data.canalPedido,
        total: data.total,
        itens: {
          create: data.itens,
        },
      },
      include: { itens: true },
    });
  },

  async findById(id: number) {
    return prisma.pedido.findUnique({
      where: { id },
      include: { itens: { include: { produto: true } }, pagamento: true },
    });
  },

  async findAll(filters: { canalPedido?: CanalPedido; status?: StatusPedido }) {
    return prisma.pedido.findMany({
      where: filters,
      include: { itens: true, pagamento: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateStatus(id: number, status: StatusPedido) {
    return prisma.pedido.update({
      where: { id },
      data: { status },
    });
  },
};