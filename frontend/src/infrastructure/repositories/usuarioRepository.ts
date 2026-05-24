import prisma from '../database/prismaClient';
import { Role } from '@prisma/client';

export const usuarioRepository = {
  async findByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  },

  async findById(id: number) {
    return prisma.usuario.findUnique({ where: { id } });
  },

  async create(data: {
    nome: string;
    email: string;
    senha: string;
    role?: Role;
    consentimentoLGPD: boolean;
  }) {
    return prisma.usuario.create({ data });
  },

  async findAll() {
    return prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        consentimentoLGPD: true,
        createdAt: true,
      },
    });
  },
};