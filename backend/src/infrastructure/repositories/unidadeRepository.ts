import prisma from '../database/prismaClient';

export const unidadeRepository = {
  async findAll() {
    return prisma.unidade.findMany({ where: { ativo: true } });
  },

  async findById(id: number) {
    return prisma.unidade.findUnique({ where: { id } });
  },

  async create(data: { nome: string; cidade: string; estado: string }) {
    return prisma.unidade.create({ data });
  },

  async update(id: number, data: { nome?: string; cidade?: string; estado?: string; ativo?: boolean }) {
    return prisma.unidade.update({ where: { id }, data });
  },
};