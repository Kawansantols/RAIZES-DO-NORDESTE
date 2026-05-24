import { fidelidadeRepository } from '../../infrastructure/repositories/fidelidadeRepository';
import { AppError } from '../../shared/errors/AppError';

export const fidelidadeService = {
  async consultar(usuarioId: number) {
    const fidelidade = await fidelidadeRepository.findByUsuario(usuarioId);
    if (!fidelidade) {
      return { usuarioId, pontos: 0 };
    }
    return fidelidade;
  },

  async adicionarPontos(usuarioId: number, pontos: number) {
    if (pontos <= 0) {
      throw new AppError('Pontos devem ser maior que zero.', 400, 'PONTOS_INVALIDOS');
    }
    return fidelidadeRepository.upsert(usuarioId, pontos);
  },

  async resgatar(usuarioId: number, pontos: number) {
    const fidelidade = await fidelidadeRepository.findByUsuario(usuarioId);
    if (!fidelidade || fidelidade.pontos < pontos) {
      throw new AppError('Pontos insuficientes para resgate.', 409, 'PONTOS_INSUFICIENTES');
    }
    return fidelidadeRepository.resgatar(usuarioId, pontos);
  },
};