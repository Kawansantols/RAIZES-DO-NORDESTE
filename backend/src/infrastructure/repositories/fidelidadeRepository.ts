import prisma from '../database/prismaClient';

export const fidelidadeRepository = {
  async findByUsuario(usuarioId: number) {
    return prisma.fidelidade.findUnique({ where: { usuarioId } });
  },

  async upsert(usuarioId: number, pontos: number) {
    return prisma.fidelidade.upsert({
      where: { usuarioId },
      update: { pontos: { increment: pontos } },
      create: { usuarioId, pontos },
    });
  },

  async resgatar(usuarioId: number, pontos: number) {
    return prisma.fidelidade.update({
      where: { usuarioId },
      data: { pontos: { decrement: pontos } },
    });
  },
};