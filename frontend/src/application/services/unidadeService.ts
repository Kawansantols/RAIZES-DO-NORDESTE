import { unidadeRepository } from '../../infrastructure/repositories/unidadeRepository';
import { AppError } from '../../shared/errors/AppError';

export const unidadeService = {
  async listar() {
    return unidadeRepository.findAll();
  },

  async buscarPorId(id: number) {
    const unidade = await unidadeRepository.findById(id);
    if (!unidade) {
      throw new AppError('Unidade não encontrada.', 404, 'UNIDADE_NAO_ENCONTRADA');
    }
    return unidade;
  },

  async criar(data: { nome: string; cidade: string; estado: string }) {
    return unidadeRepository.create(data);
  },

  async atualizar(id: number, data: { nome?: string; cidade?: string; estado?: string; ativo?: boolean }) {
    await unidadeService.buscarPorId(id);
    return unidadeRepository.update(id, data);
  },
};