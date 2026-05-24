import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usuarioRepository } from '../../infrastructure/repositories/usuarioRepository';
import { AppError } from '../../shared/errors/AppError';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'raizes_nordeste_secret_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export const authService = {
  async register(data: {
    nome: string;
    email: string;
    senha: string;
    role?: Role;
    consentimentoLGPD: boolean;
  }) {
    const usuarioExistente = await usuarioRepository.findByEmail(data.email);
    if (usuarioExistente) {
      throw new AppError('E-mail já cadastrado.', 409, 'EMAIL_JA_CADASTRADO');
    }

    if (!data.consentimentoLGPD) {
      throw new AppError(
        'É necessário aceitar os termos de uso e política de privacidade.',
        400,
        'CONSENTIMENTO_LGPD_OBRIGATORIO'
      );
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const usuario = await usuarioRepository.create({
      ...data,
      senha: senhaHash,
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    };
  },

  async login(email: string, senha: string) {
    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario || !usuario.ativo) {
      throw new AppError('E-mail ou senha inválidos.', 401, 'CREDENCIAIS_INVALIDAS');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new AppError('E-mail ou senha inválidos.', 401, 'CREDENCIAIS_INVALIDAS');
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: JWT_EXPIRES_IN,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  },
};