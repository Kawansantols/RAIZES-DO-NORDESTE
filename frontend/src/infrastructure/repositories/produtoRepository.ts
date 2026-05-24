import prisma from '../database/prismaClient';

export const produtoRepository = {
  async findAll(unidadeId: number) {
    return prisma.produto.findMany({
      where: { unidadeId, ativo: true },
      include: { estoque: true },
    });
  },

  async findById(id: number) {
    return prisma.produto.findUnique({
      where: { id },
      include: { estoque: true },
    });
  },

  async create(data: {
    nome: string;
    descricao?: string;
    preco: number;
    unidadeId: number;
  }) {
    return prisma.produto.create({ data });
  },

  async update(id: number, data: {
    nome?: string;
    descricao?: string;
    preco?: number;
    ativo?: boolean;
  }) {
    return prisma.produto.update({ where: { id }, data });
  },
};