import { produtoRepository } from '../../infrastructure/repositories/produtoRepository';
import { unidadeRepository } from '../../infrastructure/repositories/unidadeRepository';
import { AppError } from '../../shared/errors/AppError';

export const produtoService = {
  async listar(unidadeId: number) {
    await unidadeRepository.findById(unidadeId).then((u) => {
      if (!u) throw new AppError('Unidade não encontrada.', 404, 'UNIDADE_NAO_ENCONTRADA');
    });
    return produtoRepository.findAll(unidadeId);
  },

  async buscarPorId(id: number) {
    const produto = await produtoRepository.findById(id);
    if (!produto) {
      throw new AppError('Produto não encontrado.', 404, 'PRODUTO_NAO_ENCONTRADO');
    }
    return produto;
  },

  async criar(data: {
    nome: string;
    descricao?: string;
    preco: number;
    unidadeId: number;
  }) {
    await unidadeRepository.findById(data.unidadeId).then((u) => {
      if (!u) throw new AppError('Unidade não encontrada.', 404, 'UNIDADE_NAO_ENCONTRADA');
    });
    return produtoRepository.create(data);
  },

  async atualizar(id: number, data: {
    nome?: string;
    descricao?: string;
    preco?: number;
    ativo?: boolean;
  }) {
    await produtoService.buscarPorId(id);
    return produtoRepository.update(id, data);
  },
};