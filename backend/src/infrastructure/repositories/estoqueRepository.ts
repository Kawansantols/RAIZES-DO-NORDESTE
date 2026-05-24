import prisma from '../database/prismaClient';

export const estoqueRepository = {
  async findByProduto(produtoId: number) {
    return prisma.estoque.findUnique({ where: { produtoId } });
  },

  async upsert(produtoId: number, unidadeId: number, quantidade: number) {
    return prisma.estoque.upsert({
      where: { produtoId },
      update: { quantidade },
      create: { produtoId, unidadeId, quantidade },
    });
  },

  async decrementar(produtoId: number, quantidade: number) {
    return prisma.estoque.update({
      where: { produtoId },
      data: { quantidade: { decrement: quantidade } },
    });
  },

  async findByUnidade(unidadeId: number) {
    return prisma.estoque.findMany({
      where: { unidadeId },
      include: { produto: true },
    });
  },
};